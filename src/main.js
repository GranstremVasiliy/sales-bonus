/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
   const { discount, sale_price, quantity } = purchase;
   const discountDecimal = 1 - ((discount || 0) / 100);
   const revenue = sale_price * discountDecimal * quantity;
   return revenue;
}



 
/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */


function calculateBonusByProfit(index, total, seller) {
    const {profit} = seller;
    if (index === 0){
        return seller.profit * 0.15;
    }
    else if (index === 1 || index === 2){
        return seller.profit * 0.10;
    }
    else if(index === total - 1) {
        return 0;
    }
    else {
        return seller.profit * 0.05;
    }
    // @TODO: Расчет бонуса от позиции в рейтинге
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
 // Здесь проверим входящие данные
 if(!data
    || !Array.isArray(data.sellers)
    || !Array.isArray(data.products)
    || !Array.isArray(data.purchase_records)
    || data.sellers.length === 0
    || data.products.length === 0
    || data.purchase_records.length === 0){
        throw new Error ('Некорректные входные данные')
    }



const { calculateRevenue, calculateBonus } = options;

if (!calculateRevenue || !calculateBonus) {
    throw new Error('Чего-то не хватает');
  }
if (typeof(calculateRevenue) !== "function" || typeof(calculateBonus) !== "function"){
    throw new Error('В переменные переданы не функции')
}
   

   // Здесь посчитаем промежуточные данные и отсортируем продавцов
const sellerStats = data.sellers.map(seller => ({
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {}
}));


const sellerIndex = Object.fromEntries(sellerStats.map(seller => [seller.id, seller]));
const productIndex = Object.fromEntries(data.products.map(product => [product.sku, product]));



data.purchase_records.forEach(record => {
    const seller = sellerIndex[record.seller_id];
    seller.sales_count += 1;
    seller.revenue += record.total_amount;
        record.items.forEach(item => {
            const product = productIndex[item.sku];
            const cost = product.purchase_price * item.quantity;
            const revenue = calculateRevenue(item, product);
            const profit = revenue - cost;
            seller.profit += profit;
            if(!seller.products_sold[item.sku]){
                seller.products_sold[item.sku] = 0;
            }
            seller.products_sold[item.sku] += item.quantity
        });

});


const sellerSorted = sellerStats.toSorted((a, b) => b.profit - a.profit);
const total = sellerSorted.length;

sellerSorted.forEach((seller, index) => {
    seller.bonus = calculateBonus(index, total, seller);
    seller.top_products = Object.entries(seller.products_sold)
    .map(([sku, quantity]) => ({sku, quantity}))
    .sort((a,b) => b.quantity - a.quantity)
    .slice(0, 10);
    });
     
    const finalReport = sellerSorted.map(seller => ({
        seller_id: seller.id,
        name: seller.name,
        revenue: +seller.revenue.toFixed(2),
        profit: +seller.profit.toFixed(2),
        sales_count: seller.sales_count,
        top_products: seller.top_products,
        bonus: +seller.bonus.toFixed(2)
    }));


    return finalReport
    
   
    





   // Вызовем функцию расчёта бонуса для каждого продавца в отсортированном массиве

   // Сформируем и вернём отчёт






    // @TODO: Проверка входных данных

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
