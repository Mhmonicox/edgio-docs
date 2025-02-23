import cn from 'classnames';
import * as React from 'react';

export const IconUmiJS = React.memo<JSX.IntrinsicElements['svg']>(
  ({className}) => (
    <svg className={cn('inline', className)} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#1CA1FA" />
      <path
        d="M19.77 16.09h-2.625v11.086c0 3.656 2.613 6.234 6.843 6.234 4.254 0 6.856-2.578 6.856-6.234V16.09h-2.625v10.875c0 2.414-1.535 4.113-4.23 4.113-2.684 0-4.22-1.7-4.22-4.113V16.09z"
        fill="#fff"
      />
    </svg>
  )
);

IconUmiJS.displayName = 'IconUmiJS';
