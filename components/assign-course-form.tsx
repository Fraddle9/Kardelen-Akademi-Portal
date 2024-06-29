import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AssignCourseForm = () => {
    const [courseId, setCourseId] = useState('');
    const [username, setUserName] = useState('');

    const handleAssignCourse = async () => {

        try {
            const response = await axios.post('/api/utilities/assigncourse', {
                username,
                courseId,
            });

            if (response.status === 200) {
                toast.success('Kurs başarıyla atandı!');
            }
        } catch (error) {
            console.error('Kurs atama hatası:', error);
            toast.error('Kurs atama sırasında bir hata oluştu!');
        }
    };

    return (
        <div className=" ml-3 mt-3 bg-gray-100 p-5 rounded-lg shadow-md inline-block">
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Kurs ID"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="text-sm w-50 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
                />
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Kullanıcı ID"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    className="text-sm w-50 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
                />
            </div>
            <div className="text-center"> {/* Butonu ortalamak için text-center sınıfı */}
                <button
                    onClick={handleAssignCourse}
                    className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition duration-300"
                >
                    Kursa Öğrenci Ata
                </button>
            </div>
        </div>
    );
};

export default AssignCourseForm;