import { useParams } from 'react-router-dom';
import BookAppointment from '../../components/BookAppointment';

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  
  return <BookAppointment doctorId={doctorId} />;
};

export default BookAppointmentPage;