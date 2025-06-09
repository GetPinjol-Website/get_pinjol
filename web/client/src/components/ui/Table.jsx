function Table({ headers, data, renderRow }) {
    if (!data || data.length === 0) {
        return <p>Tidak ada data untuk ditampilkan.</p>;
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {renderRow(item)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;