import React, { useState, useEffect } from 'react'
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
import { searchQueryChanged, searchArtist, setSearchQuery } from '../reduxStore/searchSlice';

function Searcher(props) {
   const dispatch = useDispatch();
   const searchResults = useSelector((state) => state.search.searchResults);
   const artistDetails = useSelector((state) => state.search.artistDetails);
   const searchQuery = useSelector((state) => state.search.searchQuery);
   const [loading, setLoading] = useState(false);
   const [tracks, setTracks] = useState([]);

   const handleInputChange = (e) => {
      dispatch(setSearchQuery(e.target.value));
   };

   useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
         if (searchQuery) {
            setLoading(true);
            dispatch(searchQueryChanged({ data: searchQuery, token: props.token }));
         }
      }, 300);
      return () => clearTimeout(delayDebounceFn);
   }, [searchQuery, dispatch]);
   useEffect(() => {
      if (searchResults?.artists?.items.length > 0) {
         const artistID = searchResults?.artists?.items[0]?.id;
         setLoading(false);
         dispatch(searchArtist({ data: artistID, token: props.token }))
      }
   }, [searchResults, dispatch])
   useEffect(() => {
      if (artistDetails.tracks.length > 0) {
         setTracks(artistDetails.tracks);
      }
   }, [artistDetails]);

   return (
      <>
         <div className="searchForm">
            <input
               className="name"
               type="text"
               placeholder="Search By Artist Name ..."
               value={searchQuery}
               onChange={handleInputChange}
            />
         </div>
         {loading ? (
            <p>Loading...</p>
         ) :
            (
               <ul>
                  {tracks.map((track) => (
                     <li key={track.id}>{track.name}</li>
                  ))}
               </ul>
            )}
      </>
   )
}

export default Searcher