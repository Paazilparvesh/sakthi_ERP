import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { OutwardList } from '@/components/OutwardComponents/OutwardList';
import OutwardDetail from '@/components/OutwardComponents/OutwardDetail';
import QAForm from '@/components/QAComponents/QAForm';
import { ProductType } from '@/types/inward.type';
import { Button } from '@/components/ui/button';

const getStatusColor = (status: string): string =>
  status?.toLowerCase() === 'completed'
    ? 'bg-green-100 text-green-800'
    : status?.toLowerCase() === 'pending'
    ? 'bg-yellow-100 text-yellow-800'
    : 'bg-gray-300 text-gray-800';

const QADashboard: React.FC = () => {
  const { toast } = useToast();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [program, setProgram] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [view, setView] = useState<'list' | 'detail' | 'qaForm'>('list');
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Load user
  const stored = localStorage.getItem('user');
  const user_roles = stored ? JSON.parse(stored).roles || [] : [];

  // Fetch data
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const [productRes, programRes] = await Promise.all([
        fetch(`${BASE_URL}/api/get_full_products/`),
        fetch(`${BASE_URL}/api/get_programer_Details/`),
      ]);

      const productData = await productRes.json();

      // const programData = await programRes.json();
      const programData = await programRes.json();

      // Validate API response
      if (
        !programData ||
        (Array.isArray(programData) && programData.length === 0)
      ) {
        toast({
          title: 'No Program Data Found',
          description: 'The server returned no records for programmer details.',
        });

        setProgram([]); // prevent errors
      } else {
        // Safe assign only if it's an array
        setProgram(Array.isArray(programData) ? programData : []);
      }

      // Ensure it's always an array

      setProducts(productData);

      //   setProgram(Array.isArray(programData) ? programData : []);
      //   setProgram(programData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fetch Error',
        description: 'Failed to load product data',
      });
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, toast]);

  useEffect(() => {
    fetchProducts();
  }, []);


  const programMaterialMap = useMemo(() => {
    const map: Record<number, boolean> = {};
    (program || []).forEach((p: any) => {
      if (p.material_details) map[p.material_details] = true;
    });
    return map;
  }, [program]);

  const filteredProducts = useMemo(() => {
    const search = searchQuery.toLowerCase();
    return products.filter((item) => {
      const matchSearch =
        item.company_name?.toLowerCase().includes(search) ||
        item.customer_name?.toLowerCase().includes(search) ||
        item.serial_number?.toLowerCase().includes(search);

      const matchStatus =
        statusFilter === 'all' ||
        item.outward_status?.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    })
    .sort((a, b) => b.id - a.id);
  }, [products, searchQuery, statusFilter]);

    const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, currentPage]);

  const filteredProgram = useMemo(() => {
    if (!selectedProduct) return [];
    return program.filter(
      (p: any) =>
        Number(p.product_details) === Number(selectedProduct.id) ||
        p.product_details?.id === selectedProduct.id
    );
  }, [program, selectedProduct]);

  const currentProduct = useMemo(() => {
    if (!selectedProduct) return null;
    return products.find((p) => p.id === selectedProduct.id) || selectedProduct;
  }, [products, selectedProduct]);

  const hasPendingProgrammedMaterial = useMemo(() => {
    if (!currentProduct) return false;

    return currentProduct.materials?.some(
      (mat: any) =>
        programMaterialMap[mat.id] &&
        String(mat.qa_status).toLowerCase() === 'pending'
    );
  }, [currentProduct, programMaterialMap]);

  const canProceedQA =
    user_roles.includes('qa') &&
    currentProduct?.outward_status?.toLowerCase() === 'pending' &&
    hasPendingProgrammedMaterial;

  return (
    <div className='p-12'>
      <div className='mx-auto'>
        {/* HEADER */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>QA Dashboard</h1>

          {view === 'list' && (
            <div className='flex gap-4'>
              <input
                type='text'
                placeholder='Search by company, customer or serial...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='border px-4 py-3 rounded-full w-full sm:w-72 text-sm outline-none focus:ring-2 focus:ring-blue-600'
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='border px-4 py-2 rounded-lg'
              >
                <option value='all'>All</option>
                <option value='pending'>Pending</option>
                <option value='completed'>Completed</option>
              </select>
            </div>
          )}

          {view === 'detail' && (
            <div className='flex gap-4'>
              <Button
                onClick={() => setView('list')}
                className='bg-gray-200 hover:bg-gray-300'
              >
                Back
              </Button>

              {canProceedQA && (
                <Button
                  onClick={() => setView('qaForm')}
                  className='bg-blue-700 text-white'
                >
                  Proceed to QA
                </Button>
              )}
            </div>
          )}
        </div>

        {/* LIST */}
        {view === 'list' && (
            <>
          <OutwardList
            product={paginatedData}
            onView={(p) => {
              setSelectedProduct(p);
              setView('detail');
            }}
            getStatusColor={getStatusColor}
            role='qa'
          />
                      {/* Pagination Buttons */}
            {totalPages > 1 && (
              <div className="flex justify-end items-center gap-3 mt-6 text-sm">

                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-1 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300"
                >
                  Prev
                </button>

                <span className="font-medium text-slate-700">
                  Page {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-1 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300"
                >
                  Next
                </button>

              </div>
            )}
          </>
        )}

        {/* DETAIL */}
        {view === 'detail' && currentProduct && (
          <OutwardDetail
            product={currentProduct}
            program={filteredProgram}
            getStatusColor={getStatusColor}
          />
        )}

        {/* QA FORM */}
        {view === 'qaForm' && currentProduct && (
          <QAForm
            productId={currentProduct.id}
            companyName={currentProduct.company_name}
            materials={currentProduct.materials.filter(
              (m: any) =>
                programMaterialMap[m.id] &&
                String(m.qa_status).toLowerCase() === 'pending'
            )}
            program={filteredProgram}
            onBack={() => setView('detail')}
            onSubmitSuccess={fetchProducts}
          />
        )}
      </div>
    </div>
  );
};

export default QADashboard;
