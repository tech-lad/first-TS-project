const getUserName = document.querySelector("#user") as HTMLInputElement;
const formSubmit : HTMLFormElement | null = document.querySelector("#form");
const main_container = document.querySelector(".main_container") as HTMLElement;

// defining the contract of an object 
interface UserData {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    url: string;
}

// reuseable function
async function myCustomFetcher <T> (url:string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options)

    if(!response.ok){
        throw new Error(`Network response was not ok - status: ${response.status}`)
    }
    
    const data = await response.json();
    console.log(data);
    return data;
}

// function to show the cards UI
function showResultUI(singleUser: UserData){
    const {avatar_url, login, url} = singleUser;
    main_container.insertAdjacentHTML(
        "beforeend", 
        `<div class="card">
            <img src=${avatar_url} alt=${login} />
            <div class="empty-msg">${login}</div>
            <hr />
            <div class="card-footer">
                <img src="${avatar_url}" alt="${login}" /> 
                <a href="${url}" target="_blank"> Github </a>
            </div>
        </div>`
        )
}

// default function call for the first starting page
const fetchUserData = (url: string) => {
    myCustomFetcher<UserData[]>(url, {}).then((userInfo) => {
        for(const singleUser of userInfo){
            showResultUI(singleUser)
        }
    })
}

fetchUserData("https://api.github.com/users")

// performing search function
formSubmit?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const searchTerm = getUserName.value.toLowerCase();

    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomFetcher <UserData[]> (url, {});
        const matchingUsers = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchTerm);
        })

        // we need to clear the previous data and the screen showing UI
        main_container.innerHTML = "";

        if(matchingUsers.length === 0){
            main_container.insertAdjacentHTML("beforeend", 
            `<div class="empty-msg">No matching users found</div>`
            )
        }
        else{
            for(const singleUser of matchingUsers){
                showResultUI(singleUser)
            }
        }
    } catch (error) {
        console.log(error)
    }
})