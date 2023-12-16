// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const featchUserRole = () => {
    const data = JSON.parse(localStorage.getItem('currentUser'));
    if (data) {
        return data.profile.name;
    } else {
        //return 'ADMIN'; //return Admin if LocalStorage is empty
    }
};
