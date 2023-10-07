// add a random photo that you found on the internet to the database
// it should run both api calls (add photo and add person)

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addPerson, recognize } from '../lib/recognition';
import { toast } from 'sonner';
import { insertFace } from '@/lib/api/hamal';

const labels = {
  title: 'חיפוש אדם במאגר',
  descritpion: 'העלו תמונה של מישהו שאתם מחפשים, אם הוא קיים במאגר הוא יוצג',
  nameLabel: 'שם האדם',
  namePlaceholder: 'מלאו את שם האדם',
  pictureLabel: 'העלאת תמונה',
  picturePlaceholder: 'בחרו תמונה מהמחשב',

  error: 'משהו השתבש',
  success: 'התמונה הועלתה בהצלחה'
};

export default function AddPhoto() {
  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<any>(null);

  const [isLoading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    await recognize(file as File, (res) => {
      console.log(res);
      setLoading(false);

      if (res.length == 0) {
        alert('מצטערים, אך נראה שאין לנו התאמה');
      } else {
        toast.success(`מצאנו ${res.length} התאמות`);
        res.forEach((r: any, index: number) => {
          const obj = {
            generatedName: r.name,
            faceId: r.uuid
          };

          fetch(`/api/hamal-search`, {
            method: 'POST',
            body: JSON.stringify({ data: obj })
          }).then(async (re) => {
            const da = await re.json();
            console.log({ da });
            setState({ ...state, [index]: da[0] });
          });
        });
      }
    });
  };

  console.log({ state });

  return (
    <div className=" p-8 pb-0 flex flex-col h-full w-4/5 mx-auto gap-8">
      <h2 className=" text-3xl"> {labels.title}</h2>
      <h4 className="text-xl">{labels.descritpion}</h4>
      <div className=" xl:w-1/2 flex flex-col gap-5">
        <div className="flex flex-col">
          <label>{labels.nameLabel}</label>
          <input
            type="text"
            placeholder={labels.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            disabled={!name || !photo}
            className=" bg-cyan-500 hover:bg-cyan-700 text-white cursor-pointer px-4 py-2 rounded-md xl:w-1/2 disabled:cursor-default  disabled:bg-slate-300"
            onClick={onSubmit}
          >
            <span>בדיקה</span>
          </button>
        )}
      </div>
      {state && (
        <>
          <h2 className=" text-2xl">תוצאות:</h2>
          <div className="flex gap-4">
            {state &&
              Object.keys(state).map((key: string) => {
                return (
                  <>
                    <div key={key}>
                      <img src={state[key].serialized} className=" w-36" />
                      מקור: {state[key].source}{' '}
                    </div>
                  </>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
