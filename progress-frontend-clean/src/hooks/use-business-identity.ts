// Frontend-only business identity hook
export const useBusinessIdentity = () => {
  return {
    data: {
      businessName: "Progress Accountants",
      tagline: "Expert accounting services in Banbury, Oxford and surrounding areas",
      phone: "+44 1295 123456",
      email: "hello@progressaccountants.co.uk",
      address: "1st Floor Beaumont House, Beaumont Road, Banbury, OX16 1RH"
    },
    isLoading: false,
    error: null
  };
};