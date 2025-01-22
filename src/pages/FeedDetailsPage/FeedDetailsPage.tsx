import React from 'react';

const FeedDetailsPage: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="wrapper overflow_hidden height_100">
      <main className="container display_flex align-items_center justify-content_center height_100">
          {children}
      </main>
    </div>
  );
};

export default FeedDetailsPage;
