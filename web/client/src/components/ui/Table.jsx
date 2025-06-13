function Table({ headers, data, renderRow, totalPages, currentPage, onPageChange }) {
  if (!data || data.length === 0) {
    return <p className="text-pgray-600 text-center py-4">Tidak ada data untuk ditampilkan.</p>;
  }

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 mx-1 rounded bg-pinjol-light-2 hover:bg-pinjol-dark-3 hover:text-white"
        >
          1
        </button>
      );
      if (startPage > 2) pages.push(<span key="start-ellipsis" className="mx-1">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i ? 'bg-pinjol-dark-3 text-white' : 'bg-pinjol-light-2 hover:bg-pinjol-dark-3 hover:text-white'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push(<span key="end-ellipsis" className="mx-1">...</span>);
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 mx-1 rounded bg-pinjol-light-2 hover:bg-pinjol-dark-3 hover:text-white"
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 rounded bg-pinjol-light-2 hover:bg-pinjol-dark-3 hover:text-white disabled:opacity-50"
        >
          &lt;
        </button>
        {pages}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 rounded bg-pinjol-light-2 hover:bg-pinjol-dark-3 hover:text-white disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="max-h-[600px] overflow-y-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-pgray-light-4 sticky top-0">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="py-4 px-6 text-left text-pgray-dark-1 font-semibold"
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
      {totalPages > 1 && renderPagination()}
    </div>
  );
}

export default Table;