import { useState } from 'react';
import { Activity } from '@/data/sampleItinerary';

interface ActivityHoverActionsProps {
  activity: Activity;
  dayIndex: number;
  activityIndex: number;
  onDelete: (dayIndex: number, activityIndex: number) => void;
  onReplace: (dayIndex: number, activityIndex: number, reason: string) => void;
}

export function ActivityHoverActions({
  activity,
  dayIndex,
  activityIndex,
  onDelete,
  onReplace,
}: ActivityHoverActionsProps) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [isReplacing, setIsReplacing] = useState(false);

  const handleReplace = () => {
    setShowModal(true);
  };

  const confirmReplace = async () => {
    if (!reason.trim()) return;
    setIsReplacing(true);
    try {
      await onReplace(dayIndex, activityIndex, reason);
      setShowModal(false);
      setReason('');
    } finally {
      setIsReplacing(false);
    }
  };

  return (
    <>
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
        <div className="flex space-x-2">
          <button
            onClick={() => onDelete(dayIndex, activityIndex)}
            className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600/90 transition-all hover:scale-110"
            title="Delete activity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={handleReplace}
            className="p-2 bg-blue-500/90 text-white rounded-full hover:bg-blue-600/90 transition-all hover:scale-110"
            title="Replace activity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Why do you want to replace this activity?</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600"
              rows={3}
              placeholder="I'd like something more..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setReason('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmReplace}
                disabled={!reason.trim() || isReplacing}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {isReplacing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Replacing...
                  </>
                ) : (
                  'Replace Activity'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
