import React from 'react'
import Signup from './Signup'
import { format } from 'date-fns';

function page() {
  return (
    <div >
      <Signup />
    </div>
  )
}

export default page

export function formatDate(dateString) {
  return format(new Date(dateString), "MMM dd, yyyy");
}
