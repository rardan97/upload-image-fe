import { useEffect, useRef, useState } from "react";
import { createUser, deleteUser, getValueUserById, listUser, updateUser } from "../services/UserService";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const ContentComponents = () => {
    const [isEditMode, setIsEditMode] = useState(false); 
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState(null);
    const [userDesc, setUserDesc] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({
        userName:'',
        userImage:'',
        userDesc:'',
        userStatus:'',
    });
    const modalRef = useRef(null);
    
    useEffect(() => {
        console.log(window.bootstrap); 
        getAllUser();
    }, []);

    function getAllUser(){
        listUser().then((response) => {
            setUsers(response.data);
            console.log(response.data);
        }).catch(error => {
            console.error(error);
        })
    }

    function clearInput(){
        setUserName('');
        setUserImage(null);
        setPreviewUrl(null);
        setUserDesc('');
        setErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setUserImage(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        } else {
            setUserImage(null);
            setPreviewUrl(null);
            setErrors({ ...errors, userImage: 'Please select a valid image file.' })
        }
    };

    function closeModal() {
        const modal = document.getElementById('exampleModal');
        if (modal) {
            const modalCloseButton = modal.querySelector('.btn-close');
            if (modalCloseButton) {
                console.log("Proccess Close");
                clearInput();
                modalCloseButton.click();
            }
        }
    }
   
    const openAddModal = () => {
        setIsEditMode(false);
        clearInput();
    };

    const openEditModal = (userData) => {
        setIsEditMode(true);
        clearInput();
        editUser(userData);
    };

    function saveUser(e){
        e.preventDefault();
        if(validateForm()){
            const userData = {userName, userImage, userDesc}
            createUser(userData).then((response) => {
                console.log(response.data);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                getAllUser();
                clearInput();
                closeModal();
            }).catch(error => {
                console.log(error);
            })
        }
    }

    function editUser(userId){
        console.log(userId);
        if (userId) {
            getValueUserById(userId).then((response) => {
                const user = response.data;
                setUserId(user.userId);
                setUserName(user.userName);
                setUserDesc(user.userDesc);
                if (user.userImage) {
                    setPreviewUrl(`http://localhost:8080/api/user/images/${user.userImage}`);
                    setUserImage(user.userImage);
                } else {
                    setUserImage(null); 
                }
            }).catch((error) => {
                console.error("Error fetching user data", error);
            });
        }
    }

    function updateProccessUser(e){
        e.preventDefault();
        if(validateForm()){
            console.log("proccess11");
            const formData = new FormData();
            formData.append('userName', userName);
            formData.append('userDesc', userDesc);
            formData.append('userId', userId);
            if (userImage && userImage instanceof File) {
                console.log("file");
                formData.append('userImage', userImage);
                formData.append('userImageOld', null);
            } else if (userImage && typeof userImage === 'string') {
                console.log("string");
                formData.append('userImage', null);
                formData.append('userImageOld', userImage);
            }

            console.log(userId);
            updateUser(userId, formData).then((response) => {
                console.log('user updated successfully:', response.data);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                getAllUser();
                clearInput();
                closeModal();
            }).catch(error => {
                console.error('Error updating user:', error);
            })
        }
    }

    function delUser(userId){
        deleteUser(userId).then((response) => {
            console.log(response.data);
            getAllUser();
        })
    }

    function validateForm(){
        let valid = true;
        const errorsCopy = {... errors}
        if(userName.trim()){
            errorsCopy.userName = '';
        }else{
            errorsCopy.userName = 'userName is required';
            valid = false;
        }

        if (userImage) {
            errorsCopy.userImage = null;
        } else {
            errorsCopy.userImage = 'userImage is required';
            valid = false;
        }

        if(userDesc.trim()){
            errorsCopy.userDesc = '';
        }else{
            errorsCopy.userDesc = 'userDesc is required';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    }

    return (
        <div>
            <div className='container rowx'>
                <div className='row'>
                    <div className='col-sm-12'>
                        <div className='d-flex flex-row-reverse mt-3'>
                            <button className='btn btn-sm btn-outline-success px-4' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={openAddModal}><IoMdAdd size={25} style={{ color: "#00a816", border: "none" }}/> <span className="orbitron-text">Add</span></button>
                        </div>
                        <hr className="hrx1"/>
                        <div className="row g-3 ">
                        {
                            users.map(user =>
                                <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-3" key={user.userId}>
                                    <div className="card shadow-lg mb-4 border-primary rounded mb-2 cardbg">
                                    <img 
                                        src={user.userImage} 
                                        className="card-img-top" 
                                        alt="..."
                                        style={{
                                            height: "280px", 
                                            objectFit: "cover", 
                                        }}
                                    />
                                    <div className="card-body text-center" >
                                        <h4 className='card-title text-white orbitron-title '>{user.userName}</h4>
                                        <p className="text-white orbitron-text">{user.userDesc}</p>
                                        <br />
                                        <hr className="hrx"/>
                                        <button className='btn btn-sm btn-outline-primary rounded px-4 ' onClick={() => openEditModal(user.userId)} data-bs-toggle="modal" data-bs-target="#exampleModal"><MdModeEditOutline size={20} style={{ color: "#0A5EB0", border: "none" }}/><span className="orbitron-text">Edit</span></button>
                                        <button className='btn btn-sm btn-outline-danger mx-1 rounded px-4' onClick={() => delUser(user.userId)}> <MdDelete size={20} style={{ color: "#D63447", border: "none" }}/> <span className="orbitron-text">Delete</span></button>
                                    </div>
                                    </div>
                                </div>                                                                                             
                            )
                        }
                        </div>
                    </div>
                </div>
            </div>            

            <div className="modal fade formbgmodal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog transparent-element">
                    <div className="modal-content formbg text-white border-primary ">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 orbitron-title" id="exampleModalLabel"> {isEditMode ? 'Edit Menu' : 'Tambah Menu'}</h1>
                            <button type="button" className="btn-close color-white" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <input 
                                    type="hidden" 
                                    name='kategoriId'
                                    value={userId}
                                />
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1 " className="form-label orbitron-text">User Name</label>
                                    <input 
                                        type="text" 
                                        name='userName'
                                        value={userName}
                                        className={`form-control orbitron-text ${errors.userName ? 'is-invalid':''}`}
                                        onChange={(e) => setUserName(e.target.value)} 
                                    />
                                    {errors.userName && <div className='invalid-feedback'>{errors.userName}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label orbitron-text">User Image</label>
                                    <input 
                                        type="file" 
                                        name='userImage'
                                        className={`form-control orbitron-text ${errors.userImage ? 'is-invalid':''}`}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        ref={fileInputRef}
                                    />

                                    {userImage && (
                                        <div className='my-2'>
                                            <img 
                                                alt='not found'
                                                width={"150"}
                                                src={previewUrl}
                                            />
                                        </div>
                                    )}
                                    {errors.userImage && <div className='invalid-feedback'>{errors.userImage}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label orbitron-text">User Desc</label>
                                    <input 
                                        type="text" 
                                        name='userDesc'
                                        value={userDesc}
                                        className={`form-control orbitron-text ${errors.userDesc ? 'is-invalid':''}`}
                                        onChange={(e) => setUserDesc(e.target.value)} 
                                    />
                                    {errors.userDesc && <div className='invalid-feedback'>{errors.userDesc}</div>}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-sm btn-outline-secondary px-4" data-bs-dismiss="modal"><span className="orbitron-text"> Close</span></button>
                            <button type="submit" className="btn btn-sm btn-outline-primary rounded px-4" onClick={isEditMode ? updateProccessUser : saveUser}><span className="orbitron-text">{isEditMode ? 'Update' : 'Submit'}</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContentComponents