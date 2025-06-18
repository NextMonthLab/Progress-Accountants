export const embedFormHandler = {
  handleSubmit: (formData: FormData) => {
    console.log('Form submission:', formData);
    return Promise.resolve({ success: true });
  }
};