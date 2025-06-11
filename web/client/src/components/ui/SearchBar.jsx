import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { REPORT_CATEGORIES, REPORT_TYPES } from '../../utils/constants';

export default function SearchBar({ onSearch, filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        label="Nama Aplikasi"
        name="appName"
        value={filters.appName || ''}
        onChange={handleChange}
        placeholder="Cari nama aplikasi..."
        className="flex-grow"
      />
      <div className="input-group">
        <label className="block text-pgray-700 font-medium mb-1">Kategori</label>
        <select
          name="category"
          value={filters.category || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-pinjol-light-4 rounded-lg"
        >
          <option value="">Semua</option>
          {REPORT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <label className="block text-pgray-700 font-medium mb-1">Tipe</label>
        <select
          name="type"
          value={filters.type || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-pinjol-light-4 rounded-lg"
        >
          <option value="">Semua</option>
          <option value={REPORT_TYPES.WEB}>Web</option>
          <option value={REPORT_TYPES.APP}>App</option>
        </select>
      </div>
      <Button type="submit" className="bg-pinjol-dark-3 text-white mt-6 md:mt-0">
        Cari
      </Button>
    </form>
  );
}