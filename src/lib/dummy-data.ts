import type { Dataset } from "./store";

// Generate realistic sales data
function generateSalesData(rows: number) {
    const products = [
        "Laptop",
        "Phone",
        "Tablet",
        "Monitor",
        "Keyboard",
        "Mouse",
        "Headphones",
        "Webcam",
    ];
    const regions = ["North", "South", "East", "West", "Central"];
    const categories = ["Electronics", "Accessories", "Peripherals"];

    return Array.from({ length: rows }, (_, i) => ({
        id: i + 1,
        date: new Date(
            2024,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
        )
            .toISOString()
            .split("T")[0],
        product: products[Math.floor(Math.random() * products.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        region: regions[Math.floor(Math.random() * regions.length)],
        quantity: Math.floor(Math.random() * 50) + 1,
        unitPrice: Math.round((Math.random() * 500 + 50) * 100) / 100,
        revenue: 0,
    })).map((row) => ({
        ...row,
        revenue: Math.round(row.quantity * row.unitPrice * 100) / 100,
    }));
}

// Generate employee performance data
function generateEmployeeData(rows: number) {
    const firstNames = [
        "Alice",
        "Bob",
        "Charlie",
        "Diana",
        "Eve",
        "Frank",
        "Grace",
        "Henry",
        "Ivy",
        "Jack",
    ];
    const lastNames = [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
    ];
    const departments = [
        "Engineering",
        "Sales",
        "Marketing",
        "HR",
        "Finance",
        "Operations",
    ];
    const positions = [
        "Manager",
        "Senior",
        "Junior",
        "Lead",
        "Director",
        "Associate",
    ];

    return Array.from({ length: rows }, (_, i) => ({
        employeeId: `EMP${String(i + 1001).padStart(4, "0")}`,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        department: departments[Math.floor(Math.random() * departments.length)],
        position: positions[Math.floor(Math.random() * positions.length)],
        salary: Math.round((Math.random() * 80000 + 40000) / 1000) * 1000,
        performanceScore: Math.round((Math.random() * 40 + 60) * 10) / 10,
        yearsAtCompany: Math.floor(Math.random() * 15) + 1,
        projectsCompleted: Math.floor(Math.random() * 30) + 1,
    }));
}

// Generate website analytics data
function generateAnalyticsData(rows: number) {
    const pages = [
        "/home",
        "/products",
        "/about",
        "/contact",
        "/blog",
        "/pricing",
        "/features",
        "/docs",
    ];
    const sources = [
        "Google",
        "Direct",
        "Facebook",
        "Twitter",
        "LinkedIn",
        "Email",
        "Referral",
    ];
    const devices = ["Desktop", "Mobile", "Tablet"];
    const countries = [
        "USA",
        "UK",
        "Canada",
        "Germany",
        "France",
        "Australia",
        "Japan",
        "India",
    ];

    return Array.from({ length: rows }, (_, i) => ({
        sessionId: `SES${String(i + 1).padStart(6, "0")}`,
        date: new Date(
            2024,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
        )
            .toISOString()
            .split("T")[0],
        page: pages[Math.floor(Math.random() * pages.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        pageViews: Math.floor(Math.random() * 10) + 1,
        sessionDuration: Math.floor(Math.random() * 600) + 10,
        bounced: Math.random() > 0.7,
        converted: Math.random() > 0.85,
    }));
}

export function generateDummyDatasets(): Dataset[] {
    const salesData = generateSalesData(150);
    const employeeData = generateEmployeeData(75);
    const analyticsData = generateAnalyticsData(200);

    const now = new Date();

    return [
        {
            id: `sales-${Date.now()}`,
            name: "Sales Report 2024",
            data: salesData,
            columns: Object.keys(salesData[0]),
            rowCount: salesData.length,
            fileSize: JSON.stringify(salesData).length,
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            updatedAt: now,
        },
        {
            id: `employees-${Date.now() + 1}`,
            name: "Employee Performance",
            data: employeeData,
            columns: Object.keys(employeeData[0]),
            rowCount: employeeData.length,
            fileSize: JSON.stringify(employeeData).length,
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            updatedAt: now,
        },
        {
            id: `analytics-${Date.now() + 2}`,
            name: "Website Analytics",
            data: analyticsData,
            columns: Object.keys(analyticsData[0]),
            rowCount: analyticsData.length,
            fileSize: JSON.stringify(analyticsData).length,
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            updatedAt: now,
        },
    ];
}
