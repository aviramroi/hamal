import { IReport } from '@/types';
import { GetStaticProps } from 'next';
import Link from 'next/link';

const labels = {
  title: 'בחרו את האפשרות המתאימה לכם',
  addPhoto: 'הוספת תמונה למאגר ',
  addPerson: 'חיפוש אדם במאגר'
};

export default function Home() {
  return (
    <div className=" p-8 pb-0 flex flex-col h-full w-4/5 mx-auto gap-8">
      <h2 className=" text-3xl"> {labels.title}</h2>
      <div className="flex gap-6">
        <Link href="/add-photo">
          <div className=" p-5 border shadow-md rounded-md hover:shadow-lg hover:cursor-pointer hover:border-slate-300">
            {labels.addPhoto}
          </div>
        </Link>
        <Link href="/add-person">
          <div className=" p-5 border shadow-md rounded-md hover:shadow-lg hover:cursor-pointer  hover:border-slate-300">
            {labels.addPerson}
          </div>
        </Link>
      </div>
    </div>
  );
}
