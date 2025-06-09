function Table({ headers, data, renderRow }) {
    if (!data || data.length === 0) {
        return <p className="text-dark-green-900">Tidak ada data untuk ditampilkan.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-cream-100 border border-gray-200">
                <thead>
                    <tr className="bg-dark-green-900 text-cream-100">
                        {headers.map((header, index) => (
                            <th key={index} className="px-4 py-2 text-left">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="border-t border-gray-200 hover:bg-cream-200">
                            {renderRow(item)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;