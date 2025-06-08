import React from 'react';

export const ReportListPage = ({ reports }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Reports</h1>
    <ul className="mt-2">{reports.map(r => <li key={r.id}>{r.appName}</li>)}</ul>
    <p><a href="/report/web" className="text-blue-500">Create Web Report</a></p>
    <p><a href="/report/app" className="text-blue-500">Create App Report</a></p>
  </div>
);

export const ReportFormPage = ({ type, onSubmit }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Create {type} Report</h1>
    <form onSubmit={onSubmit} className="mt-4">
      <input type="text" name="appName" placeholder="App Name" className="border p-2 mb-2 w-full" />
      <textarea name="description" placeholder="Description" className="border p-2 mb-2 w-full"></textarea>
      {type === 'web' && <input type="date" name="incidentDate" className="border p-2 mb-2 w-full" />}
      <button type="submit" className="bg-blue-500 text-white p-2">Submit</button>
    </form>
    <p id="message" className="mt-2"></p>
  </div>
);