// src/pages/Medicine.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Medicine } from '../types/medicine';
import '../styles/medicine.css';

const Medicine: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching medicines...');
      
      // Simple query - just get all data
      const { data, error } = await supabase
        .from('Medicines')
        .select('*');

      if (error) {
        console.error('Error:', error);
        setError(error.message);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('No data found');
        setMedicines([]);
        setFilteredMedicines([]);
        setLoading(false);
        return;
      }

      console.log(`✅ Loaded ${data.length} medicines`);
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (err: any) {
      console.error('Error:', err);
      if (!error) {
        setError(err.message || 'Failed to load medicines');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter medicines based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const filtered = medicines.filter(med =>
        med.product_name?.toLowerCase().includes(query) ||
        med.salt_composition?.toLowerCase().includes(query) ||
        med.sub_category?.toLowerCase().includes(query) ||
        med.product_manufactured?.toLowerCase().includes(query)
      );
      setFilteredMedicines(filtered);
    } else {
      setFilteredMedicines(medicines);
    }
    setCurrentPage(1);
  }, [medicines, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const formatPrice = (price: string) => {
    if (!price) return 'N/A';
    return `₹${price}`;
  };

  // Pagination
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMedicines = filteredMedicines.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="medicine-loading">
        <div className="spinner"></div>
        <p>Loading medicines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="medicine-error">
        <p>❌ {error}</p>
        <button onClick={loadMedicines}>🔄 Retry</button>
      </div>
    );
  }

  return (
    <div className="medicine-page">
      <div className="medicine-header">
        <div>
          <h1>💊 Medicine Directory</h1>
          <p className="medicine-count">Total: {medicines.length} medicines</p>
        </div>
        <button className="refresh-btn" onClick={loadMedicines}>
          🔄 Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, salt, category, or manufacturer..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
          <span className="search-count">
            {filteredMedicines.length} results
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="medicine-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Salt Composition</th>
              <th>Manufacturer</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentMedicines.map((medicine, index) => (
              <tr key={medicine.Id}>
                <td>{startIndex + index + 1}</td>
                <td className="product-name">{medicine.product_name || 'N/A'}</td>
                <td>
                  <span className="category-badge">{medicine.sub_category || 'Uncategorized'}</span>
                </td>
                <td>{medicine.salt_composition || 'N/A'}</td>
                <td>{medicine.product_manufactured || 'N/A'}</td>
                <td className="price">{formatPrice(medicine.product_price)}</td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={() => setSelectedMedicine(medicine)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMedicines.length === 0 && (
          <div className="no-results">
            <p>No medicines found matching your search.</p>
            <button onClick={() => setSearchQuery('')}>Clear Search</button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ← Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages} 
            (Showing {startIndex + 1} - {Math.min(endIndex, filteredMedicines.length)} of {filteredMedicines.length})
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next →
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedMedicine && (
        <div className="modal-overlay" onClick={() => setSelectedMedicine(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMedicine(null)}>×</button>
            
            <h2 className="modal-title">{selectedMedicine.product_name || 'Unnamed Medicine'}</h2>
            
            <div className="modal-body">
              <div className="modal-detail">
                <span className="modal-label">Category</span>
                <span>{selectedMedicine.sub_category || 'N/A'}</span>
              </div>
              <div className="modal-detail">
                <span className="modal-label">Salt Composition</span>
                <span>{selectedMedicine.salt_composition || 'N/A'}</span>
              </div>
              <div className="modal-detail">
                <span className="modal-label">Price</span>
                <span className="modal-price">{formatPrice(selectedMedicine.product_price)}</span>
              </div>
              <div className="modal-detail">
                <span className="modal-label">Manufactured By</span>
                <span>{selectedMedicine.product_manufactured || 'N/A'}</span>
              </div>
              {selectedMedicine.medicine_desc && (
                <div className="modal-detail">
                  <span className="modal-label">Description</span>
                  <p>{selectedMedicine.medicine_desc}</p>
                </div>
              )}
              {selectedMedicine.side_effects && (
                <div className="modal-detail">
                  <span className="modal-label">Side Effects</span>
                  <p>{selectedMedicine.side_effects}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicine;