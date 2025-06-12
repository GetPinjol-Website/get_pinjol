import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { EDUCATION_CATEGORIES } from '../../utils/constants';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function SearchFilter({ onSearch, filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-4 mb-8 bg-pinjol-light-2 p-6 rounded-xl shadow-md"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Input
        label="Cari Edukasi"
        name="search"
        value={filters.search || ''}
        onChange={handleChange}
        placeholder="Cari judul edukasi..."
        className="flex-grow"
      />
      <div className="input-group">
        <label className="block text-pgray-700 font-medium mb-1">Kategori</label>
        <select
          name="category"
          value={filters.category || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-pinjol-light-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pinjol-dark-3"
        >
          <option value="">Semua Kategori</option>
          {EDUCATION_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="submit"
        className="bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2 mt-6 md:mt-0"
      >
        <i className="fas fa-search mr-2"></i> Cari
      </Button>
    </motion.form>
  );
}

export default SearchFilter;