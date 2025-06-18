export const EMBED_FORMS = {
  CONTACT: 'https://your-domain.com/form/4'
};

export const FORM_CONFIG = {
  height: '650px',
  scrolling: 'yes'
};

export const hasValidEmbedCode = (formType: string) => {
  return EMBED_FORMS[formType as keyof typeof EMBED_FORMS] !== undefined;
};

export const embedFormHandler = {
  handleSubmit: (formData: FormData) => {
    console.log('Form submission:', formData);
    return Promise.resolve({ success: true });
  }
};