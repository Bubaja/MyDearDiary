import React from 'react';
import { useRoute } from '@react-navigation/native';
import PrivacyPolicy from './legal/PrivacyPolicy';
import TermsOfService from './legal/TermsOfService';

type RouteParams = {
  documentType: 'privacy-policy' | 'terms-of-service';
};

const LegalScreen = () => {
  const route = useRoute();
  const { documentType } = route.params as RouteParams;

  if (documentType === 'privacy-policy') {
    return <PrivacyPolicy />;
  }

  return <TermsOfService />;
};

export default LegalScreen; 