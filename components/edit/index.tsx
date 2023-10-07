import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { fields, IField, injuryDetails, more, treatment } from '@/lib/types';
import { IReport } from '@/types';
import AWS from 'aws-sdk';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { totalmem } from 'os';
import { AuthContext } from 'context';

// should fill with relevant details
const AWS_ACCESS_KEY_ID = 'AKIAQVJW6EGPAOLP2JPF';
const AWS_SECRET_ACCESS_KEY = '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';
const AWS_S3_JSON_BUCKET_NAME = 'zofim-injury';

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3({
  region: 'eu-central-1'
});

async function s3_json_upload(file: any, name: string) {
  const params = {
    Bucket: AWS_S3_JSON_BUCKET_NAME,
    Key: `pics/injury/${name}`,
    Body: file
    // ContentType: 'application/json; charset=utf-8'
  };
  try {
    return await s3
      .upload(params)
      .promise()
      .then((data: any) => {
        // console.log(`File uploaded successfully.  ${data.Location}`);
        // should save the file to the form

        return data;
      })
      .catch((err: any) => {
        console.log({ err });
        throw err;
      });
  } catch (e) {
    console.log(e);
    // should send some tracking
    return 'Failed';
  }
}

export const EditForm = ({
  data,
  onClose
}: {
  data: IReport;
  onClose: () => void;
}) => {
  const [state, setState] = useState({
    ...data,
    'troopName,parentName': `${data.troopName} - ${data.parentName}`
  });
  const [log, setLog] = useState('');
  const { replace, asPath } = useRouter();
  const { user } = useContext(AuthContext);

  const handleChange = (value: unknown, key: keyof IReport) => {
    let newState = { ...state };
    //@ts-ignore
    newState[key] = value;
    setState(newState);
  };

  const handleSave = async () => {
    if (!log) {
      toast.error('חייב למלא הערות לשינוי');
    } else {
      // here should be the history log

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/logs/${data.id}`,
        {
          method: 'POST',
          body: JSON.stringify({
            reportId: data.id,
            comments: log,
            username: user.account.name ?? ''
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const newState = {
        ...state,
        troopName: (state as any)['troopName,parentName'].split('-')[0] ?? '',
        parentName: (state as any)['troopName,parentName'].split('-')[1] ?? ''
      };

      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/injury/${data.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(newState),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.status == 200) {
        toast.success('השינויים נשמרו בהצלחה');
        onClose();
      } else {
        toast.error('אופס משהו השתבש');
      }
    }
  };

  const hanldeUploadFile = async (e: any) => {
    const file = e.target.files[0];
    const d = await s3_json_upload(file, file.name);
    const serialized = d.Location.replace(
      'https://zofim-injury.s3.eu-central-1.amazonaws.com/pics/injury/',
      ''
    );

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/file/${data.id}`,
      {
        method: 'POST',
        body: JSON.stringify({ fileName: file.name, filePath: serialized }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (res.status === 200) {
      toast.success('הקובץ התווסף בהצלחה');
    } else {
      toast.error('אופס.. משהו השתבש');
    }
  };

  return (
    <div className=" flex flex-col overflow-y-scroll h-11 grow p-4">
      <div
        style={{ background: '#e3e3e3' }}
        className=" absolute top-0 left-0 -translate-y-full p-3 pb-1 hover:bg-slate-400 rounded-t-md "
      >
        <button onClick={handleSave}>שמירה</button>
      </div>
      <div>
        <textarea
          className=" w-full"
          value={log}
          onChange={(e) => setLog(e.target.value)}
          placeholder="הערות לשינויים"
        />
      </div>
      <div className=" grid grid-cols-4  gap-2">
        {fields.map((f: IField) => {
          return (
            <Field
              key={f.label}
              f={f}
              data={state}
              handleChange={handleChange}
            />
          );
        })}
      </div>
      <div className=" gap-2">
        {injuryDetails.map((f) => {
          return (
            <Field
              key={f.label}
              f={f}
              data={state}
              handleChange={handleChange}
            />
          );
        })}
      </div>
      <div className=" grid grid-cols-4 gap-2">
        {treatment.map((f) => {
          return (
            <Field
              key={f.label}
              f={f}
              data={state}
              handleChange={handleChange}
            />
          );
        })}
      </div>
      {more.map((f) => {
        return (
          <Field key={f.label} f={f} data={state} handleChange={handleChange} />
        );
      })}

      <div>
        <div>להעלת קבצים:</div>
        <input type="file" onChange={hanldeUploadFile} />
      </div>
    </div>
  );
};

const Field = ({
  data,
  f,
  handleChange
}: {
  data: IReport;
  f: {
    key: string | string[];
    label: string;
    type?: 'date' | 'bool' | 'textbox';
    isConst?: boolean;
  };
  handleChange: (v: string, v2: keyof IReport) => void;
}) => {
  return (
    <div key={f.label} className="flex flex-col mb-2">
      <b>{f.label}:</b>
      <span>
        {f.type === 'bool' ? (
          //   String((data as any)[f.key]) === '1' ? (
          //     'כן'
          //   ) : (
          //     'לא'
          //   )
          <select
            value={String((data as any)[f.key as string])}
            onChange={(e) => {
              handleChange(e.target.value, f.key as keyof IReport);
            }}
          >
            <option value={'1'}>כן</option>
            <option value={'0'}>לא</option>
          </select>
        ) : (
          <>
            {f.type === 'date' ? (
              f.isConst ? (
                <>
                  {dayjs(
                    (data as any)[f.key as string],
                    'YYYY-MM-DD HH:mm:ss'
                  ).format('DD/MM/YYYY')}
                </>
              ) : (
                <input
                  type="date"
                  value={(data as any)[f.key as string]}
                  onChange={(e) =>
                    handleChange(e.target.value, f.key as keyof IReport)
                  }
                />
              )
            ) : f.type === 'textbox' ? (
              <div>
                <textarea
                  className=" w-full"
                  value={(data as any)[f.key as string]}
                  onChange={(e) =>
                    handleChange(e.target.value, f.key as keyof IReport)
                  }
                />
              </div>
            ) : (
              <div className=" flex flex-col">
                <input
                  value={(data as any)[f.key as string]}
                  onChange={(e) =>
                    handleChange(e.target.value, f.key as keyof IReport)
                  }
                />
              </div>
            )}
          </>
        )}
      </span>
    </div>
  );
};
