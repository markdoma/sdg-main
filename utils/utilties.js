// Function to calculate age based on birthdate
export const calculateAge = (birthdate) => {
  if (!birthdate || !birthdate.seconds) {
    // If the birthdate is null or does not have the 'seconds' property, return 0 or any default value
    return 0;
  }
  const today = new Date();
  // Convert birthdate (in seconds) to milliseconds by multiplying with 1000
  const birthDate = new Date(birthdate.seconds * 1000);
  let age = today.getFullYear() - birthDate.getFullYear();
  // console.log(birthdate);
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};
