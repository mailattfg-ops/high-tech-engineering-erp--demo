export const firmOptions = ['Hi Tech Engineering - Main', 'Hi Tech Electricals', 'Hi Tech Plumbing Supplies'];

export const sampleProducts = [
  { id: 'P001', name: 'Anchor Roma 6A Switch', brand: 'Anchor', category: 'Electricals', subCategory: 'Switches', company: 'Anchor Electricals', group: 'Modular Switches', quality: 'High Quality', unit: 'Nos', purchasePrice: 45, retailPrice: 67, mrp: 75, stock: 240, minStock: 50, maxStock: 500, rack: 'A-01', barcode: '8901234567890', gstRate: 18 },
  { id: 'P002', name: 'Legrand 16A Socket', brand: 'Legrand', category: 'Electricals', subCategory: 'Sockets', company: 'Legrand India', group: 'Modular Sockets', quality: 'High Quality', unit: 'Nos', purchasePrice: 120, retailPrice: 178, mrp: 210, stock: 85, minStock: 20, maxStock: 200, rack: 'A-02', barcode: '8901234567891', gstRate: 18 },
  { id: 'P003', name: 'Finolex 1.5 sq mm Wire (100m)', brand: 'Finolex', category: 'Electricals', subCategory: 'Cables', company: 'Finolex Cables', group: 'Wires', quality: 'High Quality', unit: 'Roll', purchasePrice: 1800, retailPrice: 2450, mrp: 2800, stock: 32, minStock: 10, maxStock: 100, rack: 'B-01', barcode: '8901234567892', gstRate: 18 },
  { id: 'P004', name: 'Havells 10A MCB', brand: 'Havells', category: 'Electricals', subCategory: 'MCB', company: 'Havells India', group: 'Protective Devices', quality: 'High Quality', unit: 'Nos', purchasePrice: 95, retailPrice: 142, mrp: 165, stock: 156, minStock: 30, maxStock: 300, rack: 'A-03', barcode: '8901234567893', gstRate: 18 },
  { id: 'P005', name: 'Supreme 1/2" CPVC Pipe (3m)', brand: 'Supreme', category: 'Plumbing', subCategory: 'Pipes', company: 'Supreme Industries', group: 'CPVC Pipes', quality: 'High Quality', unit: 'Pcs', purchasePrice: 210, retailPrice: 295, mrp: 340, stock: 5, minStock: 20, maxStock: 200, rack: 'C-01', barcode: '8901234567894', gstRate: 18 },
  { id: 'P006', name: 'Astral 3/4" CPVC Elbow', brand: 'Astral', category: 'Plumbing', subCategory: 'Fittings', company: 'Astral Pipes', group: 'Fittings', quality: 'High Quality', unit: 'Nos', purchasePrice: 28, retailPrice: 42, mrp: 52, stock: 420, minStock: 50, maxStock: 1000, rack: 'C-02', barcode: '8901234567895', gstRate: 18 },
  { id: 'P007', name: 'Asian Paints Primer (1L)', brand: 'Asian Paints', category: 'Building Materials', subCategory: 'Paints', company: 'Asian Paints', group: 'Primers', quality: 'High Quality', unit: 'Litre', purchasePrice: 180, retailPrice: 255, mrp: 290, stock: 0, minStock: 10, maxStock: 100, rack: 'D-01', barcode: '8901234567896', gstRate: 18 },
  { id: 'P008', name: 'Stanley 25mm Drill Bit', brand: 'Stanley', category: 'Hardware', subCategory: 'Tools', company: 'Stanley Works', group: 'Drill Bits', quality: 'Medium Quality', unit: 'Nos', purchasePrice: 65, retailPrice: 98, mrp: 120, stock: 78, minStock: 10, maxStock: 200, rack: 'E-01', barcode: '8901234567897', gstRate: 18 },
  { id: 'P009', name: 'Unistrut C-Clamp 20mm', brand: 'Unistrut', category: 'Hardware', subCategory: 'Fasteners', company: 'Generic', group: 'Clamps', quality: 'Medium Quality', unit: 'Nos', purchasePrice: 12, retailPrice: 20, mrp: 25, stock: 890, minStock: 100, maxStock: 5000, rack: 'E-02', barcode: '8901234567898', gstRate: 18 },
  { id: 'P010', name: 'Kajaria Floor Tile 60x60 (Box)', brand: 'Kajaria', category: 'Building Materials', subCategory: 'Tiles', company: 'Kajaria Ceramics', group: 'Floor Tiles', quality: 'High Quality', unit: 'Box', purchasePrice: 680, retailPrice: 920, mrp: 1100, stock: 18, minStock: 5, maxStock: 100, rack: 'F-01', barcode: '8901234567899', gstRate: 18 },
];

export const sampleCustomers = [
  { id: 'C001', name: 'Suresh Builders Pvt Ltd', mobile: '9876543210', type: 'Project', gstin: '32ABCDE1234F1Z5', city: 'Ernakulam', credit: 45000, balance: -12500, priceType: 'Project Price' },
  { id: 'C002', name: 'Kerala Constructions', mobile: '9876543211', type: 'Wholesale', gstin: '32FGHIJ1234F1Z5', city: 'Thrissur', credit: 100000, balance: 8000, priceType: 'Wholesale Price' },
  { id: 'C003', name: 'Rajan Nair', mobile: '9876543212', type: 'Retail', gstin: '', city: 'Kochi', credit: 5000, balance: -2000, priceType: 'Retail Price' },
  { id: 'C004', name: 'Vishnu Electricals', mobile: '9876543213', type: 'Wholesale', gstin: '32KLMNO1234F1Z5', city: 'Kozhikode', credit: 50000, balance: 0, priceType: 'Wholesale Price' },
  { id: 'C005', name: 'Divya Plumbing Works', mobile: '9876543214', type: 'Retail', gstin: '', city: 'Thiruvananthapuram', credit: 10000, balance: -5500, priceType: 'Retail Price' },
];

export const sampleSalesmen = [
  { id: 'S001', name: 'Arun Kumar', role: 'Salesman', firm: 'Hi Tech Engineering - Main', commission: 2 },
  { id: 'S002', name: 'Priya Menon', role: 'Sales Assistant', firm: 'Hi Tech Electricals', commission: 1.5 },
  { id: 'S003', name: 'Rajan Thomas', role: 'Manager', firm: 'Hi Tech Engineering - Main', commission: 3 },
  { id: 'S004', name: 'Sini Raj', role: 'Sales Assistant', firm: 'Hi Tech Plumbing Supplies', commission: 1.5 },
];

export const dashboardData = {
  cashSales: 284500,
  creditSales: 568200,
  cashPurchase: 198400,
  creditPurchase: 342100,
  receivable: 89500,
  payable: 44200,
  loans: 250000,
  expenses: 35800,
  balance: 186500,
  stockValue: 2840000,
  negativeStock: 2,
  deadStock: 8,
  dueBills: 14,
};

export const salesTrendData = [
  { month: 'Nov', sales: 285000, purchase: 198000, profit: 87000 },
  { month: 'Dec', sales: 342000, purchase: 245000, profit: 97000 },
  { month: 'Jan', sales: 298000, purchase: 210000, profit: 88000 },
  { month: 'Feb', sales: 385000, purchase: 265000, profit: 120000 },
  { month: 'Mar', sales: 420000, purchase: 298000, profit: 122000 },
  { month: 'Apr', sales: 468000, purchase: 325000, profit: 143000 },
  { month: 'May', sales: 385000, purchase: 258000, profit: 127000 },
];

export const categoryData = [
  { name: 'Electricals', value: 42 },
  { name: 'Plumbing', value: 28 },
  { name: 'Hardware', value: 18 },
  { name: 'Building Mat.', value: 12 },
];

export const dueBillsData = [
  { id: 'INV-2024-0456', customer: 'Suresh Builders Pvt Ltd', amount: 45800, due: '2025-01-10', days: 38, type: 'GST' },
  { id: 'INV-2024-0478', customer: 'Rajan Nair', amount: 8200, due: '2025-01-15', days: 33, type: 'Non-GST' },
  { id: 'INV-2024-0512', customer: 'Divya Plumbing Works', amount: 12500, due: '2025-01-20', days: 28, type: 'Non-GST' },
  { id: 'INV-2024-0534', customer: 'Kerala Constructions', amount: 89600, due: '2025-01-25', days: 23, type: 'GST' },
  { id: 'INV-2024-0545', customer: 'Vishnu Electricals', amount: 34200, due: '2025-01-28', days: 20, type: 'GST' },
];

export const marginCategories = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200];

export const priceTypes = [
  { key: 'retailPrice', label: 'Retail Price', discountPct: 0 },
  { key: 'retailDiscount', label: 'Retail Discount', discountPct: 10 },
  { key: 'specialDiscount', label: 'Special Discount', discountPct: 20 },
  { key: 'quotationPrice', label: 'Quotation Price', discountPct: 30 },
  { key: 'projectPrice', label: 'Project Price', discountPct: 40 },
  { key: 'projectDiscount', label: 'Project Discount', discountPct: 50 },
  { key: 'wholesalePrice', label: 'Wholesale Price', discountPct: 60 },
  { key: 'wholesaleDiscount', label: 'Wholesale Discount', discountPct: 70 },
  { key: 'gstPrice', label: 'GST Price', discountPct: 80 },
  { key: 'branchPrice', label: 'Branch Price', discountPct: 90 },
];

export const recentSales = [
  { id: 'INV-2025-0678', date: '2025-05-19', customer: 'Rajan Nair', salesman: 'Arun Kumar', amount: 4850, type: 'Cash', billType: 'Non-GST', status: 'Paid' },
  { id: 'INV-2025-0677', date: '2025-05-19', customer: 'Kerala Constructions', salesman: 'Priya Menon', amount: 89200, type: 'Credit', billType: 'GST', status: 'Due' },
  { id: 'INV-2025-0676', date: '2025-05-19', customer: 'Suresh Builders Pvt Ltd', salesman: 'Rajan Thomas', amount: 24500, type: 'Credit', billType: 'GST', status: 'Due' },
  { id: 'INV-2025-0675', date: '2025-05-18', customer: 'Vishnu Electricals', salesman: 'Arun Kumar', amount: 12800, type: 'Cash', billType: 'Non-GST', status: 'Paid' },
  { id: 'INV-2025-0674', date: '2025-05-18', customer: 'Divya Plumbing Works', salesman: 'Sini Raj', amount: 6500, type: 'Credit', billType: 'Non-GST', status: 'Partial' },
];

export const purchaseData = [
  { id: 'PO-2025-0189', date: '2025-05-19', supplier: 'Anchor Electricals Dist.', amount: 48200, type: 'Credit', status: 'Received' },
  { id: 'PO-2025-0188', date: '2025-05-18', supplier: 'Supreme Industries', amount: 21500, type: 'Cash', status: 'Received' },
  { id: 'PO-2025-0187', date: '2025-05-17', supplier: 'Kajaria Ceramics Dist.', amount: 68400, type: 'Credit', status: 'Partial' },
  { id: 'PO-2025-0186', date: '2025-05-16', supplier: 'Havells India Dist.', amount: 35600, type: 'Credit', status: 'Pending' },
];

export const staffLeaderboard = [
  { name: 'Arun Kumar', role: 'Salesman', sales: 285400, points: 2854, commission: 5708 },
  { name: 'Rajan Thomas', role: 'Manager', sales: 342000, points: 3420, commission: 10260 },
  { name: 'Priya Menon', role: 'Sales Assistant', sales: 198200, points: 1982, commission: 2973 },
  { name: 'Sini Raj', role: 'Sales Assistant', sales: 145800, points: 1458, commission: 2187 },
];
