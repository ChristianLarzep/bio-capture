import validate from '../lib/validate';

import formVoiceValidations from './formVoice/formVoiceValidations';

export const constraints = {
  ...formVoiceValidations,
};

export default values => validate(values, constraints);
