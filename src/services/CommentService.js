import axios from 'axios';

class CommentService {
  static BASE_URL = 'http://192.168.231.243:3000/comments';

  static async createComment(articleId, userName, message) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        this.BASE_URL, 
        { articleId, userName, message },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  static async getArticleComments(articleUrl, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${this.BASE_URL}/${articleId}`, {
        params: { page, limit }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }
}

export default CommentService;
