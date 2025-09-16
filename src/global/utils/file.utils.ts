export const fileToBase64 = (file: File): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      if (!result || typeof result !== "string") {
        resolve(undefined);
        return;
      }

      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
  });
};
