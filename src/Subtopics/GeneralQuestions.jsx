import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { addQuestionAPI, deleteQuestionAPI, getGeneralQuestionAPI } from '../Services/allAPI';
import EditQuestions from './EditQuestions';
import { editQuestionResponseContext } from '../Context/Contextshare';
import { useLocation } from 'react-router-dom';

function GeneralQuestions() {

    const location = useLocation()
    const passedData = location.state?.data
  
    const sectionName = passedData.section_name
    const categoryName = passedData.category
  
    // console.log(sectionName,categoryName);
    
  
    const {editResponse} = useContext(editQuestionResponseContext)
    
    const [qstn,setQstn] = useState({
      section_name:sectionName, //sectionName and categoryName came from the passedData above,
      category:categoryName, //passedData came from subtomicsHome.jsx
      question:"",
      option_a:"",
      option_b:"",
      option_c:"",
      option_d:"",
      answer:"",
      explanation:""
              
    })
    // console.log(qstn);
    
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
  
    const handleCancel = ()=>{
        setQstn({
          section_name:sectionName,
          category:categoryName,
          question:"",
          option_a:"",
          option_b:"",
          option_c:"",
          option_d:"",
          answer:"",
          explanation:""
        })
      }
  
    const handleClose = () => {
        if(!qstn.question && !qstn.option_a && !qstn.option_b && !qstn.option_c && !qstn.option_d && !qstn.answer && !qstn.explanation){
          setShow(false)
        }
        else{
          const confMsg = window.confirm("Discard changes?")
          if(confMsg){
            handleCancel()
            setShow(false)
          }
        }
      }
    const [generalQuestions, setGeneralQuestions] = useState([])  
  
    const [qstnAdded, setQstnAdded] = useState(false)
  
    //Function to add question
    const addQuestion = async(e)=>{
      e.preventDefault()
      const {question,option_a,option_b,option_c,option_d,answer,explanation} = qstn
      if(!question || !option_a || !option_b || !option_c || !option_d || !answer || !explanation){
        alert("Please fill all the fields!")
      }else{
        try{
          const result = await addQuestionAPI(qstn)
        console.log(result);
  
        if(result.status === 200){
          alert('Question added successfully.')
          setQstnAdded(!qstnAdded)
          handleCancel()
        }else{
          alert(`${result.response.data}`)
        }
      }catch(err){
        console.log(`Request failed due to ${err}`);
        alert('Oops!? something went wrong!')
      }
      }
    }
  
    //function to get arith pot questions
    const getGeneralQuestions = async()=>{
      const result = await getGeneralQuestionAPI(sectionName,categoryName);
      console.log(result.data);
      setGeneralQuestions(result.data)
    }
  
    //for re-rendering the data when a new question is added. the data will also display when the page initially render.
    useEffect(()=>{
      getGeneralQuestions();
    },[qstnAdded,editResponse])
  
    //for deleting a question
    const handleDelete = async(id) =>{
      const confMsg = window.confirm("Are you sure!?")
      if(confMsg){
        const result = await deleteQuestionAPI(id,qstn)
        console.log(result);
        if(result.status === 200){
          getGeneralQuestions()
        }else{
          console.log(result.response.data);
        
        }
      }
      
    }
   
    return (
      <>
        <div className="addnewbtn d-flex justify-content-end ">
            <Button className='' onClick={handleShow}>
                Add<i class="fa-solid fa-plus"></i>
            </Button>
        </div>
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} animation={true} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add a new question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="totalform row">
              <div className="col-md-6">
                  <div >
                      <textarea name='question' id='question' className='form-control' placeholder='Enter question' value={qstn.question} onChange={(e)=>setQstn({...qstn,question:e.target.value})}/>
                  </div>
                  <div className="options">
                      <div className="option-one d-flex gap-2">
                          <span className='d-flex align-items-center'>A</span>
                          <input type="text" className='form-control' placeholder='Option A' value={qstn.option_a} onChange={(e)=>setQstn({...qstn,option_a:e.target.value})}/>
                      </div>
                      <div className="option-one d-flex gap-2">
                          <span className='d-flex align-items-center'>B</span>
                          <input type="text" className='form-control' placeholder='Option B' value={qstn.option_b} onChange={(e)=>setQstn({...qstn,option_b:e.target.value})}/>
                      </div>
                      <div className="option-one d-flex gap-2">
                          <span className='d-flex align-items-center'>C</span>
                          <input type="text" className='form-control' placeholder='Option C' value={qstn.option_c} onChange={(e)=>setQstn({...qstn,option_c:e.target.value})}/>
                      </div>
                      <div className="option-one d-flex gap-2">
                          <span className='d-flex align-items-center'>D</span>
                          <input type="text" className='form-control' placeholder='Option D'value={qstn.option_d} onChange={(e)=>setQstn({...qstn,option_d:e.target.value})}/>
                      </div>
                  </div>
              </div>
  
              <div className="col-md-6">
                  <div className='d-flex gap-3'>
                      <div className=' d-flex align-items-center'>
                          <p className='m-0'>Choose the correct answer</p>
                      </div>
                  {/* <Dropdown onSelect={handleChange}> */}
                      {/* <Dropdown.Toggle variant="" className='border border-dark rounded-1 py-0 p-1' id="dropdown-basic"> */}
                      {/* <i class="fa-solid fa-caret-down"></i> */}
                      {/* </Dropdown.Toggle> */}
  
                      <select value={qstn.answer}  onChange={(e)=>setQstn({...qstn,answer:e.target.value})}>
                          <option href="#/action-1" value="">Choose one</option>
                          <option href="#/action-1" value={qstn.option_a}>{qstn.option_a}</option>
                          <option href="#/action-2" value={qstn.option_b}>{qstn.option_b}</option>
                          <option href="#/action-3" value={qstn.option_c}>{qstn.option_c}</option>
                          <option href="#/action-4" value={qstn.option_d}>{qstn.option_d}</option>
                      </select>
                  {/* </Dropdown> */}
                  </div>
                  <div>
                      <textarea name="explanation" id="explanation" placeholder='Write the explanation here.' className='form-control' rows={7} value={qstn.explanation} onChange={(e)=>setQstn({...qstn,explanation:e.target.value})}></textarea>
                  </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className='me-auto' variant="secondary" onClick={handleCancel}>
              Clear all
            </Button>
            <Button variant="primary" onClick={addQuestion}>Add</Button>
          </Modal.Footer>
        </Modal>
  
       {generalQuestions?.length > 0?(
        generalQuestions.map((item,index)=>(
          <div className="container-fluid" key={index}>
            <div className="">
              <span>{index+1}</span>
              <span>{item.question}</span>
            </div>
            <div className="">
              <ol type='A'>
                <li>{item.option_a}</li>
                <li>{item.option_b}</li>
                <li>{item.option_c}</li>
                <li>{item.option_d}</li>
              </ol>
            </div>
            <div className="">
              <div className="">
                {item.answer}
              </div>
              <div className="">
                {item.explanation}
              </div>
              <div className="d-flex">
                <div className="">
                  <EditQuestions qnInfos = {{section_name:passedData.section_name,category:passedData.category,...item}}/>
                </div>
                <div className="">
                  <button onClick={()=>handleDelete(item._id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))
       )
       :
       (
         <div className="">
         <span>No questions added yet!</span>
       </div>
       )
      }
        
      </>
    )
  }

export default GeneralQuestions