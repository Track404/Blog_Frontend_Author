import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
const CreatePosts = () => {
  const [editorValue, setEditorValue] = useState(''); // Store the editor's content in state
  const [formData, setFormData] = useState({}); // Store form data, including editor content
  const [error, setError] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!token) {
      setError('No token found, please log in');
      return;
    }

    try {
      // Decode the token to get user info from the payload
      const decodedToken = jwtDecode(token);
      setFormData({ ...formData, authorId: Number(decodedToken.id) });
      console.log(decodedToken); // Set the decoded user data in state
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Invalid or expired token');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleEditorChange = (content) => {
    setEditorValue(content); // Update the editor content in state
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the form data
    const data = {
      content: editorValue, // Include the editor's HTML content
      title: formData.title,
      authorId: formData.authorId,
      // Example of other form data (e.g., title)
    };

    // Send data to the server
    fetch('https://charismatic-learning-production.up.railway.app/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Send the data as JSON
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setTimeout(() => navigate('/blog'), 2000);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form data state
  };

  return (
    <ProtectedRoute>
      <div>
        {error && <p>{String(error)}</p>}
        <h2>Submit Your Post</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="editor">Content:</label>
            <Editor
              apiKey="qywowhwjqextz11hdjztqf1xujnb754v12295andbs07r48h"
              value={editorValue}
              init={{
                plugins: [
                  // Core editing features
                  'anchor',
                  'autolink',
                  'charmap',
                  'codesample',
                  'emoticons',
                  'image',
                  'link',
                  'lists',
                  'media',
                  'searchreplace',
                  'table',
                  'visualblocks',
                  'wordcount',
                  // Your account includes a free trial of TinyMCE premium features
                  // Try the most popular premium features until Feb 17, 2025:
                  'checklist',
                  'mediaembed',
                  'casechange',
                  'export',
                  'formatpainter',
                  'pageembed',
                  'a11ychecker',
                  'tinymcespellchecker',
                  'permanentpen',
                  'powerpaste',
                  'advtable',
                  'advcode',
                  'editimage',
                  'advtemplate',
                  'ai',
                  'mentions',
                  'tinycomments',
                  'tableofcontents',
                  'footnotes',
                  'mergetags',
                  'autocorrect',
                  'typography',
                  'inlinecss',
                  'markdown',
                  'importword',
                  'exportword',
                  'exportpdf',
                ],
                toolbar:
                  'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                tinycomments_mode: 'embedded',
                tinycomments_author: 'Author name',
                mergetags_list: [
                  { value: 'First.Name', title: 'First Name' },
                  { value: 'Email', title: 'Email' },
                ],
                ai_request: (request, respondWith) =>
                  respondWith.string(() =>
                    Promise.reject('See docs to implement AI Assistant')
                  ),
              }}
              onEditorChange={handleEditorChange}
              initialValue="Welcome to TinyMCE!"
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default CreatePosts;
