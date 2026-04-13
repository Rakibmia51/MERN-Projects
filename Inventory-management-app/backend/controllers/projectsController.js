const Projects = require("../models/project");

const createProject =async(req, res)=>{

    try {
        // ১. সবশেষ প্রজেক্টটি খুঁজে বের করা (সিরিয়াল কোডের জন্য)
        const lastProject = await Projects.findOne().sort({ createdAt: -1 });
        
        let nextNumber = 1;
        if (lastProject && lastProject.projectCode) {
        // PRJ-0001 থেকে নম্বরটি আলাদা করা
        const lastNumber = parseInt(lastProject.projectCode.split('-')[1]);
        nextNumber = lastNumber + 1;
        }

        // ২. নম্বরটিকে PRJ-0001 ফরম্যাটে রূপান্তর করা
        const formattedCode = `PRJ-${nextNumber.toString().padStart(4, '0')}`;

        // ৩. নতুন প্রজেক্ট তৈরি
        const newProject = new Projects({
        ...req.body,
        projectCode: formattedCode
        });

        await newProject.save();
        return res.status(201).json({success: true, message: 'Project Create successfully'})
        // res.status(201).json(savedProject);
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}


const getProjects =async(req, res)=>{
    try {
        const projects = await Projects.find().sort({ createdAt: -1 });
        return res.status(200).json({success:true, projects})
    } catch (error) {
       return res.status(500).json({success: false, message: error.message})
    }
}


const getProject = async(req, res)=>{
    try {
        const project = await Projects.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteProject = async (req, res) => {

  try {
    const {id} = req.params;
    // check if the project exists
    const existringProject = await Projects.findById(id)
    if(!existringProject){
        return res.status(404).json({
            success: false,
            message: "Project not found",
        });
    }

    await Projects.findByIdAndDelete(id);
        return res.status(200).json({
            success: true, 
            message: "Project deleted successfully" 
        });
  } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message 
        });
  }
};

// Update Project
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and update the project with new data from req.body
        const updatedProject = await Projects.findByIdAndUpdate(
            id,
            { $set: req.body },
            { returnDocument: 'after', runValidators: true } 
        );

        if (!updatedProject) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Project updated successfully",
            project: updatedProject 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {createProject, getProjects, getProject, deleteProject, updateProject}