function Badge({ text, type }) {
  const badgeStyles = {
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
    positive: 'bg-green-100 text-green-800',
    negative: 'bg-red-100 text-red-800',
    web: 'bg-pinjol-light-3 text-pinjol-dark-2',
    app: 'bg-pinjol-light-4 text-pinjol-dark-3',
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${badgeStyles[type] || 'bg-gray-100 text-gray-800'}`}
    >
      {text}
    </span>
  );
}

export default Badge;