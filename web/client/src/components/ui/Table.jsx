function Table({ headers, data, renderRow }) {
  if (!data || data.length === 0) {
    return <p className="text-pgray-600 text-center">No data to display.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-pgray-light-4">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="py-4 px-6 text-left text-pgray-dark-1"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-pgray-light-3">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-pgray-light-100">{renderRow(item)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;