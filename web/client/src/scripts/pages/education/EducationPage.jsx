import React from 'react';

export const EducationListPage = ({ educations, onSelect }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Education List</h1>
    <ul className="mt-2">{educations.map(e => <li key={e.id}><a href={`/education/${e.id}`} className="text-blue-500">{e.title}</a></li>)}</ul>
  </div>
);

export const EducationDetailPage = ({ education }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Education Detail</h1>
    <p>{education?.content}</p>
  </div>
);