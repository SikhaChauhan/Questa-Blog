import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

  const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
          console.log(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
      console.log(error)
    }
  };
  return (
    <div className='max-w-3xl min-h-screen p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col justify-between gap-4 sm:flex-row'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
        </div>
        <div className='flex items-center justify-between gap-4 p-3 border-4 border-teal-500 border-dotted'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            className='bg-gradient-to-br from-pink-500 via-red-500 to-pink-700'
            size='md'
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                  
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='object-cover w-full h-72'
          />
        )}
        <ReactQuill
          theme='snow'
          value={formData.content}
          placeholder='Write something...'
          className='mb-12 h-72'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' className='pt-2 pb-2 pl-2 pr-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
          Update post
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}








// import React, { useEffect, useState } from "react";
// import { Alert, Button, FileInput, TextInput } from "flowbite-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import {
//   getDownloadURL,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { storage } from "../firebase";
// import { CircularProgressbar } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";

// export default function UpdatePost() {
//   const [file, setFile] = useState(null);
//   const [imageUploadProgress, setImageUploadProgress] = useState(null);
//   const [imageUploadError, setImageUploadError] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [publishError, setPublishError] = useState(null);
//   const { postId } = useParams();
//   const navigate = useNavigate();
//   const { currentUser } = useSelector((state) => state.user);

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const res = await fetch(`/api/post/getposts?postId=${postId}`);
//         const data = await res.json();
//         if (!res.ok) {
//           setPublishError(data.message);
//           return;
//         }
//         setFormData(data.posts[0]);
//       } catch (error) {
//         console.error("Error fetching post:", error);
//       }
//     };
//     fetchPost();
//   }, [postId]);

//   const handleUploadImage = () => {
//     if (!file) {
//       setImageUploadError("Please select an image.");
//       return;
//     }
//     setImageUploadError(null);
//     const fileName = `${Date.now()}-${file.name}`;
//     const storageRef = ref(storage, fileName);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress = Math.round(
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//         );
//         setImageUploadProgress(progress);
//       },
//       (error) => {
//         console.error("Image upload error:", error);
//         setImageUploadError("Image upload failed.");
//         setImageUploadProgress(null);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           setFormData({ ...formData, image: downloadURL });
//           setImageUploadProgress(null);
//         });
//       }
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setPublishError(data.message);
//         return;
//       }
//       navigate(`/post/${data.slug}`);
//     } catch (error) {
//       console.error("Error updating post:", error);
//       setPublishError("Something went wrong.");
//     }
//   };

//   return (
//     <div className="max-w-3xl min-h-screen p-3 mx-auto">
//       <h1 className="text-3xl font-semibold text-center my-7">Update Post</h1>
//       <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//         <TextInput
//           type="text"
//           placeholder="Title"
//           required
//           value={formData.title || ""}
//           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//         />
//         <div className="flex items-center gap-4 p-3 border-4 border-teal-500 border-dotted">
//           <FileInput
//             accept="image/*"
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//           <Button
//             type="button"
//             onClick={handleUploadImage}
//             disabled={!!imageUploadProgress}
//           >
//             {imageUploadProgress ? (
//               <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress}%`} />
//             ) : (
//               "Upload Image"
//             )}
//           </Button>
//         </div>
//         {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
//         {formData.image && <img src={formData.image} alt="Preview" className="object-cover w-full h-72" />}
//         <ReactQuill
//           theme="snow"
//           value={formData.content || ""}
//           onChange={(value) => setFormData({ ...formData, content: value })}
//           className="h-72"
//         />
//         <Button type="submit" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
//           Update Post
//         </Button>
//         {publishError && <Alert color="failure" className="mt-5">{publishError}</Alert>}
//       </form>
//     </div>
//   );
// }
