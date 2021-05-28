import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, NavLink, useHistory, Link } from 'react-router-dom';
import palette from '../../images/palette.jpg'
import './Dashboard.css';
import { reblogPost } from '../../store/post'
import {findAUser} from '../../store/user'
import { likeAPost, showLikes, unLikePost } from '../../store/likes'
import { followBlog, showFollows, unFollowBlog } from '../../store/follows'

   const Post = ({post, followed, liked}) => {
      const [following, setFollowing] = useState(false)
      const [love, setLove] = useState(false)
       const dispatch = useDispatch();
       const sessionUser = useSelector((state) => state.session.user)
      const blogId = post.User.Blog.id;
      const history = useHistory()

      const reblog = (e) => {
         history.push(`/${post.id}/reblog`)
      }
      
      useEffect(() => {
            if (followed.includes(blogId)) {
               setFollowing(true)
            } else {
               setFollowing(false)
            }   
      },[followed])

      useEffect(() => {
         if (liked.includes(post.id)) {
            setLove(true)
         } else {
            setLove(false)
         }    
      },[liked])


      const follow = (e) => {
         // !following ?
         !followed.includes(blogId) ?
         dispatch(followBlog({
            userId: sessionUser.id,
            blogId: blogId
         })).then(() => {
             followed.push(blogId) 
             setFollowing(true)
         }) :
         dispatch(unFollowBlog({
            userId: sessionUser.id,
            blogId: blogId,
         })).then(() => {
             followed = followed.filter((follow) => follow !== blogId)
             setFollowing(false)
         })
      }

      const like = (e) => {
         !liked.includes(post.id) ?
            dispatch(likeAPost({
               userId: sessionUser.id,
               postId: post.id
            })).then(() => {
                liked.push(post.id)
                setLove(true)
            }) :
            dispatch(unLikePost({
               userId: sessionUser.id,
               postId: post.id
            })).then(() => {
                liked = liked.filter((like) => like !== post.id)    
                setLove(false)
            })
         }

         return (
            <div className='dash'
               key={post.id}>
               <img src={post.User.avatar || palette}
                  alt='avatar'
                  className='avatar' />
               <div className='content-div'>
                  <div className='blog-info'>
                     <a href={`/${post.User.blogName}`}>
                           {post.User.blogName}
                     </a>
                     <i className = 'fas fa-sync-alt' style={{paddingLeft: '20px'}}/>
                     <a href={`/${post.Owner.blogName}`}>
                        {post.Owner.blogName}
                     </a>
                     <p className='follow'
                        style={following ?
                           {color: 'gray', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' } :
                           {color: 'DeepSkyBlue',
                           fontWeight: 'bold',
                           fontSize: '11px',
                           cursor: 'pointer'
                           }}
                        value={blogId}
                        onClick={follow}
                     >Follow</p>
                  </div>
                  <div className='underline'>
                  </div>
                  {post.type === 'image' &&
                     <img 
                        src={post.content}
                        alt='picture'
                        className='dash-img' />}
                  {post.type === 'words' && (
                     <p>{post.content}</p>
                  )}
                  {post.type === 'link' && (
                     <div className='link'>
                        <a href={post.content}>
                           {post.content}
                        </a>
                     </div>
                  )}
                  <div className='caption-div'>
                     <Link to={`/${post.Owner.blogName}`} style={{color: 'deepskyblue'}}>
                        {post.Owner.blogName}:
                     </Link>
                     <span style={{paddingLeft: '5px'}}>
                        {post.caption}
                     </span>
                  </div>
                  <div className='underline'>
                  </div>
                  <div className='dash-btns'>
                     <i className="fas fa-heart fa-lg"
                        value={post.id}
                        onClick={like}
                        style={love ? {color: 'red'} : {color: 'none'}}
                     />
                     <i className="fas fa-sync-alt fa-lg" onClick={reblog}/>
                  </div>
                  <a href='/posts/id/likes' 
                  className='likes'>
                     {post.Likes.length} likes
                  </a>
               </div>
            </div>
         )
      }

      export default Post;