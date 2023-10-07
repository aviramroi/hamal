// add a random photo that you found on the internet to the database
// it should run both api calls (add photo and add person)

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addPerson } from '../lib/recognition';
import { toast } from 'sonner';

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

export default function AddPhoto() {
  const [photo, setPhoto] = useState('');
  const [source, setSource] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    await addPerson(uuidv4(), file as File, '', (res) => {
      console.log(res);
      if (res.status === 'success') {
        setLoading(false);
        toast.success(labels.success);
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
