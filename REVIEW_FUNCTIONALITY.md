# Review Functionality Documentation

## Overview

The MedDesk application includes a comprehensive review system that allows patients to rate and review doctors after completed appointments. The system includes moderation capabilities for administrators and provides detailed analytics.

## Features

### Patient Features
- **Write Reviews**: Patients can write reviews for doctors after completed appointments
- **Star Rating**: 1-5 star rating system with interactive UI
- **Anonymous Reviews**: Option to submit reviews anonymously
- **Edit Reviews**: Patients can edit their own reviews (except rejected ones)
- **Delete Reviews**: Patients can delete their own reviews
- **View Reviews**: Patients can view all their submitted reviews
- **Character Limits**: Title (100 chars), Review content (1000 chars)

### Doctor Features
- **View Reviews**: Doctors can see all approved reviews for their profile
- **Rating Analytics**: Automatic calculation of average ratings
- **Review Notifications**: Doctors receive notifications when new reviews are submitted

### Admin Features
- **Review Moderation**: Approve or reject pending reviews
- **Moderation Reasons**: Provide reasons for rejecting reviews
- **Bulk Management**: View all pending reviews in one place

### System Features
- **One Review Per Appointment**: Prevents duplicate reviews for the same appointment
- **Automatic Rating Updates**: Doctor ratings are automatically updated when reviews are approved/rejected
- **Review Status Tracking**: Pending, Approved, Rejected status system
- **Pagination**: Efficient loading of large review lists
- **Real-time Updates**: Reviews update in real-time across the application

## API Endpoints

### Public Endpoints
- `GET /api/reviews/doctor/:doctorId` - Get approved reviews for a doctor

### Patient Endpoints (Authenticated)
- `POST /api/reviews` - Create a new review
- `GET /api/reviews/my-reviews` - Get patient's own reviews
- `PATCH /api/reviews/:reviewId` - Update a review
- `DELETE /api/reviews/:reviewId` - Delete a review

### Admin Endpoints (Admin Only)
- `GET /api/reviews/pending` - Get all pending reviews
- `PATCH /api/reviews/:reviewId/moderate` - Approve/reject a review

## Database Schema

### Review Model
```javascript
{
  doctor: ObjectId (ref: User),
  patient: ObjectId (ref: User),
  appointment: ObjectId (ref: Appointment, unique),
  rating: Number (1-5),
  title: String (max 100 chars),
  review: String (max 1000 chars),
  status: String (pending/approved/rejected),
  moderationReason: String,
  isAnonymous: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Components

### Pages
- `Reviews.jsx` - Main reviews page for patients
- Patient dashboard integration for quick review access

### Components
- `StarRating.jsx` - Interactive star rating component
- `ReviewModal.jsx` - Modal for editing reviews
- `DoctorReviews.jsx` - Display reviews on doctor profiles

### Utilities
- `reviewUtils.js` - Helper functions for review calculations and validation
- Rating distribution calculations
- Review status formatting
- Date formatting utilities

## Usage Examples

### Writing a Review
1. Patient completes an appointment
2. Patient navigates to Reviews page with doctor and appointment parameters
3. Patient fills out rating, title, and review content
4. Optional: Mark as anonymous
5. Submit for moderation

### Viewing Doctor Reviews
1. Visit doctor profile page
2. Reviews are displayed with rating distribution
3. Pagination for large review lists
4. Average rating calculation displayed

### Admin Moderation
1. Admin accesses pending reviews
2. Reviews can be approved or rejected with reasons
3. Patients are notified of moderation decisions
4. Doctor ratings are updated automatically

## Security Features
- **Authentication Required**: All write operations require valid JWT tokens
- **Authorization Checks**: Patients can only edit their own reviews
- **Input Validation**: Server-side validation for all review data
- **XSS Protection**: All user input is sanitized
- **Rate Limiting**: Prevents spam review submissions

## Performance Optimizations
- **Database Indexing**: Optimized queries for doctor and patient reviews
- **Pagination**: Efficient loading of large datasets
- **Caching**: Review statistics are cached for better performance
- **Lazy Loading**: Reviews load on demand

## Integration Points
- **Appointment System**: Reviews are linked to completed appointments
- **User System**: Integration with doctor and patient profiles
- **Notification System**: Automated notifications for review events
- **Rating System**: Automatic doctor rating calculations

## Error Handling
- **Validation Errors**: Clear error messages for invalid input
- **Duplicate Prevention**: Cannot review the same appointment twice
- **Permission Errors**: Proper error handling for unauthorized actions
- **Network Errors**: Graceful handling of connection issues

## Future Enhancements
- Review response system (doctors can respond to reviews)
- Review helpfulness voting
- Advanced filtering and sorting options
- Review analytics dashboard
- Bulk review operations for admins