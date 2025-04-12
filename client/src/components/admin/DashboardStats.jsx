import React from 'react';
import {
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
} from '@heroicons/react/outline';

const DashboardStats = ({ stats }) => {
  const { totalSales, totalOrders, totalUsers, averageOrderValue } = stats;
  
  const statItems = [
    {
      name: 'Total Sales',
      value: totalSales ? `$${totalSales.toFixed(2)}` : '$0.00',
      icon: CurrencyDollarIcon,
      change: '+10.1%',
      changeType: 'increase',
    },
    {
      name: 'Total Orders',
      value: totalOrders || 0,
      icon: ShoppingBagIcon,
      change: '+5.4%',
      changeType: 'increase',
    },
    {
      name: 'Average Order Value',
      value: averageOrderValue ? `$${averageOrderValue.toFixed(2)}` : '$0.00',
      icon: ShoppingCartIcon,
      change: '+2.3%',
      changeType: 'increase',
    },
    {
      name: 'Total Customers',
      value: totalUsers || 0,
      icon: UsersIcon,
      change: '+7.8%',
      changeType: 'increase',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div
          key={item.name}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 mr-4">
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.name}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`inline-flex items-center text-sm ${
                item.changeType === 'increase'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {item.changeType === 'increase' ? (
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  ></path>
                </svg>
              )}
              <span>{item.change} from last month</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;