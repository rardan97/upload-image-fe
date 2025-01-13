import { useEffect, useRef, useState } from "react";
import { createUser, deleteUser, getValueUserById, listUser, updateUser } from "../services/UserService";
import { FaReact } from "react-icons/fa"; 
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdBookmarkAdd } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";

const ContentComponents = () => {
 
   
    const [isEditMode, setIsEditMode] = useState(false); 
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState(null);
    const [userDesk, setUserDesk] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({
        userName:'',
        userImage:'',
        userDesk:'',
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
        setUserDesk('');
        
        setErrors({});

        if (fileInputRef.current) {
            fileInputRef.current.value = '';  // Reset the file input
          }
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {
            setUserImage(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        } else {
            setUserImage(null);
            setPreviewUrl(null); // Reset preview
            setErrors({ ...errors, userImage: 'Please select a valid image file.' })
            
        }
    };

    

    

    function closeModal() {
        const modal = document.getElementById('exampleModal'); // Pastikan modal memiliki ID yang benar
        if (modal) {
            const modalCloseButton = modal.querySelector('.btn-close');
            if (modalCloseButton) {
                console.log("Proccess Close");
                clearInput();
                modalCloseButton.click(); // Ini akan menutup modal
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
        // setUser(userData);  // Mengisi form dengan data produk yang akan diedit
      };
    


    function saveUser(e){
        e.preventDefault();
        if(validateForm()){
            const userData = {userName, userImage, userDesk}
            createUser(userData).then((response) => {
                console.log(response.data);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';  // Mengosongkan input file
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
                
                // Mengatur nilai produk di state
                setUserId(user.userId);
                setUserName(user.userName);
                setUserDesk(user.userDesk);

                // Jika userImage ada, simpan URL untuk preview
                if (user.userImage) {
                    setPreviewUrl(`${user.userImage}`);
                    setUserImage(user.userImage);  // Simpan nama gambar di state untuk referensi
                } else {
                    // setPreviewUrl(null);
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
            formData.append('userDesk', userDesk);
            formData.append('userId', userId);
            if (userImage && userImage instanceof File) {
                formData.append('userImage', userImage);
            } else if (userImage && typeof userImage === 'string') {
                formData.append('userImage', userImage);
            }

            console.log(userId);
            updateUser(userId, formData).then((response) => {
                console.log('user updated successfully:', response.data);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';  // Mengosongkan input file
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

        if (userImage) {  // Check if userImage is not null or undefined
            errorsCopy.userImage = null;
          } else {
            errorsCopy.userImage = 'userImage is required';
            valid = false;
          }

        if(userDesk.trim()){
            errorsCopy.userDesk = '';
        }else{
            errorsCopy.userDesk = 'userDesk is required';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    }





  return (
    <div>
        <div className='container-fluid rowx'>
            <div className='row'>
            
                
                <div className='col-sm-12'>
                    
                    <div className='d-flex flex-row-reverse mt-3'>
                        <button className='btn btn-sm btn-success mx-4' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={openAddModal}><MdBookmarkAdd size={25} style={{ color: "white", border: "none" }}/> Add Menu</button>
                    </div>
                    <div className=''>
                        <h4>User</h4>
                        <hr />
                    </div>
                    <div className="container d-flex justify-content-center align-items-center">
             {/* ==================== */}
                
{/* ===================== */}
                </div>
           
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-6 g-4">
                    <div className="col">
                        <div className="card h-100">
                        <img src="/public/ironman.jpg" className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title">Iron Man</h5>
                            <p className="card-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
                            <p className="card-text"><MdEmail /> email@gmail.com</p>
                            <p className="card-text"><FaPhoneAlt /> +62812345678</p>
                            <p className="card-text"> <FaMapMarkerAlt /> Indonesia</p>
                          
                            
                        </div>
                        <div className="card-footer">
                           <button className='btn btn-sm btn-outline-primary rounded px-2'  data-bs-toggle="modal" data-bs-target="#exampleModal"><MdModeEditOutline size={20} style={{ color: "#0A5EB0", border: "none" }}/> Edit </button>
                           <button className='btn btn-sm btn-outline-danger mx-1 rounded' > <MdDelete size={20} style={{ color: "#D63447", border: "none" }}/> Delete</button>
                           </div>
                        
                        </div>
                    </div>
                    
                </div>
                    
                    <div className="row g-3 ">
                    {
                        users.map(user =>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2" key={user.userId}>
                                <div className="card shadow-lg mb-4 rounded border-0">
                                <img 
                                    src={user.userImage} 
                                    className="card-img-top" 
                                    alt="..."
                                    style={{
                                        height: "160px", // Mengatur tinggi
                                        objectFit: "cover", // Opsional: Mengontrol proporsi
                                      }}
                                />
                                <div className="card-body text-center" >
                                    <h4 style={{ color: "#D63447"}} className='card-title'>{user.userName}</h4>
                                    {/* <p className="fst-italic lh-sm">{user.userDesk}</p> */}
                                    <br />
                                    <hr />
                                    <button className='btn btn-sm btn-outline-primary rounded px-2' onClick={() => openEditModal(user.userId)} data-bs-toggle="modal" data-bs-target="#exampleModal"><MdModeEditOutline size={20} style={{ color: "#0A5EB0", border: "none" }}/> Edit </button>
                                    <button className='btn btn-sm btn-outline-danger mx-1 rounded' onClick={() => delUser(user.userId)}> <MdDelete size={20} style={{ color: "#D63447", border: "none" }}/> Delete</button>
                                </div>
                                </div>
                            </div>
                        )
                    }
                    </div>
                  
                    
                    
                    <br />
                    <br />
                </div>
            </div>
        </div>

        

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel"> {isEditMode ? 'Edit Menu' : 'Tambah Menu'}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <input 
                                type="hidden" 
                                name='kategoriId'
                                value={userId}
                            />
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">userName</label>
                                <input 
                                    type="text" 
                                    name='userName'
                                    value={userName}
                                    className={`form-control ${errors.userName ? 'is-invalid':''}`}
                                    onChange={(e) => setUserName(e.target.value)} 
                                />
                                {errors.userName && <div className='invalid-feedback'>{errors.userName}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">userImage</label>
                                <input 
                                    type="file" 
                                    name='userImage'
                                    className={`form-control ${errors.userImage ? 'is-invalid':''}`}
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
                                <label htmlFor="exampleInputEmail1" className="form-label">userDesk</label>
                                <input 
                                    type="text" 
                                    name='userDesk'
                                    value={userDesk}
                                    className={`form-control ${errors.userDesk ? 'is-invalid':''}`}
                                    onChange={(e) => setUserDesk(e.target.value)} 
                                />
                                {errors.userDesk && <div className='invalid-feedback'>{errors.userDesk}</div>}
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button className="btn btn-sm btn-primary" onClick={saveUser}>Save</button>
                        <button className="btn btn-sm btn-primary" onClick={updateProccessUser}>Update</button>
                        
                    </div>
                </div>
            </div>
        </div>

    </div>
 
  )
}

export default ContentComponents
