const { Op, fn, col, literal } = require('sequelize');
const { User, Product, Order } = require('../databases/sequelize/models');

exports.getTotals = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalProducts = await Product.count();
        const totalOrders = await Order.count();
        const totalRevenue = await Order.sum('total');

        const startOfLastMonth = new Date();
        startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1, 1);
        startOfLastMonth.setHours(0, 0, 0, 0);

        const endOfLastMonth = new Date(startOfLastMonth);
        endOfLastMonth.setMonth(endOfLastMonth.getMonth() + 1, 0);
        endOfLastMonth.setHours(23, 59, 59, 999);

        const previousUsers = await User.count({
            where: { createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] } }
        });
        const previousProducts = await Product.count({
            where: { createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] } }
        });
        const previousOrders = await Order.count({
            where: { createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] } }
        });
        const previousRevenue = await Order.sum('total', {
            where: { createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] } }
        });

        const yearStart = new Date();
        yearStart.setMonth(0, 1);
        yearStart.setHours(0, 0, 0, 0);

        const yearEnd = new Date();
        yearEnd.setMonth(11, 31);
        yearEnd.setHours(23, 59, 59, 999);

        const monthlyOrders = await Order.findAll({
            attributes: [
                [literal("DATE_FORMAT(created_at, '%Y-%m')"), 'month'],
                [fn('SUM', col('total')), 'totalRevenue'],
                [fn('COUNT', col('*')), 'totalOrders']
            ],
            where: { createdAt: { [Op.between]: [yearStart, yearEnd] } },
            group: [literal("DATE_FORMAT(created_at, '%Y-%m')")],
            order: [literal("DATE_FORMAT(created_at, '%Y-%m')")]
        });

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const seriesData = {
            revenue: Array(12).fill(0),
            orders: Array(12).fill(0)
        };

        monthlyOrders.forEach(record => {
            const [year, month] = record.dataValues.month.split('-');
            const monthIndex = parseInt(month, 10) - 1; 

            if (monthIndex >= 0 && monthIndex < 12) {
                seriesData.revenue[monthIndex] = parseFloat(record.dataValues.totalRevenue) || 0;
                seriesData.orders[monthIndex] = parseInt(record.dataValues.totalOrders) || 0;
            } else {
                console.error(`Index de mois hors de portée: ${monthIndex}`);
            }
        });

        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Dimanche
        const endOfWeek = new Date(today.setDate(today.getDate() + (6 - today.getDay()))); // Samedi
        startOfWeek.setHours(0, 0, 0, 0);
        endOfWeek.setHours(23, 59, 59, 999);
     
       const date1 = new Date( startOfWeek.setHours(0, 0, 0, 0));
       const date2 = new Date(endOfWeek.setHours(23, 59, 59, 999));

        const dailyOrders = await Order.findAll({
            attributes: [
                [literal("DATE_FORMAT(created_at, '%Y-%m-%d')"), 'day'],
                [fn('SUM', col('total')), 'totalRevenue'],
                [fn('COUNT', col('*')), 'totalOrders']
            ],
            where: { createdAt: { [Op.between]: [startOfWeek, endOfWeek] } },
            group: [literal("DATE_FORMAT(created_at, '%Y-%m-%d')")],
            order: [literal("DATE_FORMAT(created_at, '%Y-%m-%d')")]
        });
        const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
        const dailyLabels = [];
        const dailySeries = {
            revenue: [],
            orders: []
        };

        dailyOrders.forEach(record => {
            const dayValue = record.dataValues.day;
            if (dayValue) {
                const dayDate = new Date(dayValue);
                const dayIndex = dayDate.getDay();
                dailyLabels.push(days[dayIndex]);
                dailySeries.revenue.push(parseFloat(record.dataValues.totalRevenue) || 0);
                dailySeries.orders.push(parseInt(record.dataValues.totalOrders) || 0);
            } else {
                console.error('Jour de l\'enregistrement est indéfini:', record);
            }
        });

        const productCountsByCategory = await Product.findAll({
            attributes: ['category', [fn('COUNT', col('*')), 'productCount']],
            group: ['category']
        });

        const categoryProductCounts = productCountsByCategory.map(record => ({
            category: record.dataValues.category,
            count: parseInt(record.dataValues.productCount) || 0
        }));
        res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            previousUsers,
            previousProducts,
            previousOrders,
            previousRevenue,
            monthlyData: {
                labels: months,
                series: [
                    { name: 'Total Ventes', data: seriesData.orders },
                    { name: 'Total Revenus', data: seriesData.revenue }
                ]
            },
            weeklyData: {
                labels: dailyLabels,
                series: [
                    { name: 'Total Ventes', data: dailySeries.orders },
                    { name: 'Total Revenus', data: dailySeries.revenue }
                ]
            },
            categoryProductCounts
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des totaux:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
