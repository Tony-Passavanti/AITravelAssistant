import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { ActivityHoverActions } from './ActivityHoverActions';

import { Activity } from '@/data/sampleItinerary';

interface ActivityCardProps {
  activity: Activity;
  dayIndex?: number;
  activityIndex?: number;
  onDelete?: (dayIndex: number, activityIndex: number) => void;
  onReplace?: (dayIndex: number, activityIndex: number, reason: string) => Promise<void>;
  showActions?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  dayIndex = 0,
  activityIndex = 0,
  onDelete,
  onReplace,
  showActions = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    // Don't toggle if the click was on a link
    if ((e.target as HTMLElement).tagName === 'A') return;
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`relative bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border-l-4 border-indigo-500 hover:shadow-lg transition-all duration-200 ${
        isExpanded ? 'ring-2 ring-indigo-500' : ''
      } group`}
    >
      {/* Action buttons container - only shown when right 25% is hovered */}
      <div className="absolute inset-y-0 right-0 w-1/4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        {showActions && onDelete && onReplace && (
          <ActivityHoverActions
            activity={activity}
            dayIndex={dayIndex}
            activityIndex={activityIndex}
            onDelete={onDelete}
            onReplace={onReplace}
          />
        )}
      </div>
      
      {/* Clickable area for the card */}
      <div 
        className="relative z-0 cursor-pointer"
        onClick={toggleExpand}
      >
      <div className="p-4 pr-16">
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {activity.title}
            </h3>
            {isExpanded && activity.time && activity.duration && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {activity.time} • {activity.duration}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {activity.priceRange && (
              <span className="px-2.5 py-0.5 text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 rounded-full whitespace-nowrap">
                {activity.priceRange}
              </span>
            )}
            <button 
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            {activity.location && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex items-center">
                <svg className="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {activity.location}
              </p>
            )}

            {activity.description && (
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {activity.description}
              </p>
            )}

            {activity.notes && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <span className="font-medium">Note:</span> {activity.notes}
                </p>
              </div>
            )}

            {activity.bookingUrl && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={activity.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add any additional click handling here if needed
                  }}
                >
                  Book Now
                  <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
