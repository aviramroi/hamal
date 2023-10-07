// add a random photo that you found on the internet to the database
// it should run both api calls (add photo and add person)

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addPerson } from '../lib/recognition';
import { toast } from 'sonner';
import { insertFace } from '@/lib/api/hamal';
import AWS from 'aws-sdk';

const labels = {
  title: 'העלת תמונה למאגר',
  descritpion: 'תמונה שרצה ברשת, תמונה מהטלוויזיה, או תמונות שצילמתם',
  sourceLabel: 'מקור התמונה',
  sourcePlaceholder: 'פרטו את מקור התמונה',
  pictureLabel: 'העלאת תמונה',
  picturePlaceholder: 'בחרו תמונה מהמחשב',

  error: 'משהו השתבש',
  success: 'התמונה הועלתה בהצלחה'
};

const AWS_ACCESS_KEY_ID = 'AKIAQVJW6EGPAOLP2JPF';
const AWS_SECRET_ACCESS_KEY = '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';
const AWS_S3_JSON_BUCKET_NAME = 'hamal';

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

export default function AddPhoto() {
  const [photo, setPhoto] = useState('');
  const [source, setSource] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const generatedName = uuidv4();
    await addPerson(generatedName, file as File, '', async (res) => {
      if (res.status === 'success') {
        // should save
        const obj = {
          source,
          photo,
          faceId: res.uuid,
          generatedName,
          file
        };

        const b = await s3_json_upload(file, generatedName);

        fetch(`/api/hamal`, {
          method: 'POST',
          body: JSON.stringify({ ...obj, serialized: b.Location }),
          headers: {
            ContentType: 'application/json'
          }
        }).then(async (r) => {
          const da = await r.json();

          setLoading(false);
          toast.success(labels.success);
        });
      } else {
        toast.error(labels.error);
      }
    });
  };

  return (
    <div className=" p-8 pb-0 flex flex-col h-full w-4/5 mx-auto gap-8">
      <h2 className=" text-3xl"> {labels.title}</h2>
      <h4 className="text-xl">{labels.descritpion}</h4>
      <div className=" xl:w-1/2 flex flex-col gap-5">
        <div className="flex flex-col">
          <label>{labels.sourceLabel}</label>
          <input
            type="text"
            placeholder={labels.sourcePlaceholder}
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>{labels.pictureLabel}</label>
          <input
            type="file"
            placeholder={labels.picturePlaceholder}
            value={photo ?? ''}
            onChange={(e) => {
              setPhoto(e.target.value);
              setFile((e.target as any)?.files[0] as any);
            }}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center">בטעינה</div>
        ) : (
          <button
            disabled={!source || !photo}
            className=" bg-cyan-500 hover:bg-cyan-700 text-white cursor-pointer px-4 py-2 rounded-md xl:w-1/2 disabled:cursor-default  disabled:bg-slate-300"
            onClick={onSubmit}
          >
            <span>העלאה</span>
          </button>
        )}
      </div>
    </div>
  );
}
