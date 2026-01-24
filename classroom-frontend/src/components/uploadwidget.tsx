import React, { useRef, useState } from 'react'

const UploadWidget = ({ value = null, onChange, disabled = false}) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChageRef = useRef(onChange);
  //it either shows the preview of the already uploaded image or show a upload image image , so it needs a state to manage it
  const [preview, setPreview] = useState(value);
  //to let the user delete the uploaded file
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const openWidget = () => {
    if(!disabled) {
      widgetRef.current?.open();
    }
  }

  const removeFromCloudinary = async () => {
    
  }
  return (
    <div className='space-y-2'></div>
  )
}

export default UploadWidget;