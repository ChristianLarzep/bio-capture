import validate from '../lib/validate';

import agendaCaptureValidations from './agendaCapture/agendaCaptureValidation';
import bioCaptureValidations from './bioCapture/bioCaptureValidations';

export const constraints = {
  ...bioCaptureValidations,
  ...agendaCaptureValidations,
};

export default values => validate(values, constraints);
