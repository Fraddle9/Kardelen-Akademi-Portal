import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Combobox } from '@/components/ui/combobox'; // Ensure Combobox is imported correctly

const AssignCourseForm = () => {
    const [courseId, setCourseId] = useState('');
    const [username, setUserName] = useState('');
    const [courses, setCourses] = useState<{ label: string; value: string; }[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');

    useEffect(() => {
        // Fetch the list of courses when the component mounts
        const fetchCourses = async () => {
            try {
                const response = await axios.get('/api/courses');
                const courses = response.data.map((course: { id: string; title: string }) => ({
                    label: course.title,
                    value: course.id,
                }));
                setCourses(courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
                toast.error('Error fetching courses!');
            }
        };

        fetchCourses();
    }, []);

    const handleAssignCourse = async () => {
        try {
            const response = await axios.post('/api/utilities/assigncourse', {
                username,
                courseId: selectedCourse,
            });

            if (response.status === 200) {
                toast.success('Kurs başarıyla atandı!');
            }
        } catch (error) {
            console.error('Kurs atama hatası:', error);
            toast.error('Kurs atama sırasında bir hata oluştu!');
        }
    };

    const handleRemoveCourse = async () => {
        try {
            const response = await axios.post('/api/utilities/removecourse', {
                username,
                courseId: selectedCourse,
            });

            if (response.status === 200) {
                toast.success('Kurs başarıyla kaldırıldı!');
            }
        } catch (error) {
            console.error('Kurs kaldırma hatası:', error);
            toast.error('Kurs kaldırma sırasında bir hata oluştu!');
        }
    };

    return (
        <div className="ml-3 mt-3 bg-gray-100 p-5 rounded-lg shadow-md inline-block">
            <div className="mb-3">
                <Combobox
                    options={courses}
                    value={selectedCourse}
                    onChange={setSelectedCourse}
                    placeholder="Kurs Seçin"
                    selectedText="Kurs Seçin"
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
            <div className="text-center"> {/* Butonları ortalamak için text-center sınıfı */}
                <button
                    onClick={handleAssignCourse}
                    className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition duration-300 mr-2"
                >
                    Tanımla
                </button>
                <button
                    onClick={handleRemoveCourse}
                    className="bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-900 transition duration-300"
                >
                    Kaldır
                </button>
            </div>
        </div>
    );
};

export default AssignCourseForm;
