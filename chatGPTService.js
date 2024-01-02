const OpenAI = require('openai');
const TutorProfile = require('./models/tutorProfile');

const apiKey = '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';
const openai = new OpenAI({ apiKey });

const generateTutorList0 = async (userPrompt) => {
    const systemInstructions = "You will be given a a free text from a student that wants to learn a certain subject for a certain grade level. Your response should strictly look like this subject;gradelevel and make sure grade level is only a number and the response is in lowercase";
    const tutors1 = await TutorProfile.find();
    const tutorsDetails = tutors1.map(tutor => {
        return `Name: ${tutor.name}, Subject: ${tutor.subjects}, grade_level: ${JSON.stringify(tutor.grade_level)}`;
    }).join('\n');

    const instructionsWithTutors = systemInstructions + tutorsDetails;

    const messages = [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: userPrompt },
    ];

    console.log(messages);

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 250,
        });

        const messageObj1 = response.choices[0].message.content;
        // console.log(messageObj.subject);
        // console.log("2");
        if (messageObj1) {
            const splitStrings = messageObj1.split(';');
            const student_subject= splitStrings[0];
            const student_grade= splitStrings[1];
            console.log(student_subject);
            console.log(student_grade);
            console.log(splitStrings);






            // Access the 'message' property of the first element in 'choices' array dynamically
            //const firstChoice = response.choices.message;
            //console.log(firstChoice);
            const extractedInformation = messageObj1;
            console.log(extractedInformation);

            if (extractedInformation) {
                return extractedInformation;
            }
        }

        console.error('Unexpected response format from OpenAI API:', response.choices);
        throw new Error('Failed to extract information from user prompt');

    } catch (error) {
        if (error.response && error.response.status === 429) {
            const retryAfter = parseInt(error.response.headers['retry-after']) || 60;
            console.log(`Rate limited. Waiting ${retryAfter} seconds and retrying...`);
            await delay(retryAfter * 1000);
            return generateTutorList(tutors, userPrompt);
        }
        console.error(error);
        throw new Error('Failed to extract information from user prompt');
    }
};

const generateTutorList = async (tutors0,userPrompt) => {
    const systemInstructions = "You are an intelligent matchmaking assistant for a tutoring platform. Your role is to assist students in finding the right tutor based on their preferences in terms of the desired subject and the desired time slots and grade level. You will receive the student's desire for the tutor's availability and subject and also a list of tutors with their respective subject and available time slots. Your task is as follows:\n1) Evaluate the tutors based on the student's preferences and provide the student with a list of suitable tutors only who match the time slots of the student. Ensure subjects match It will be written just after the tutor's name. If subject or grade level does not match exclude tutor. This list must include the tutors who are suitable to teach the student the response format must include the tutor's name, the tutor's fit score.\n2) Assign a fit score to each tutor, ranging from 0.00 (no fit) to 10.00 (perfect fit), scoring system guidelines: score 0 in 3 cases only if 1 the time slots does not fit at all, 2 if the subject does not fit, 3 if the grade level does not fit. If a tutor's score is 0 you must exclude from the response. If there are three or more tutors suitable, provide names and scores for the top 3 best-fit tutors.\n3) Ask the student if they want to confirm adding the tutors to their list of favorites. If they wish to proceed with adding all the suitable tutors or not, ask the student to confirm by pressing the add to favorites button on the bottom left and end the conversation there. If not, they should press cancel. Lastly a very important note if all the tutors score 0 your response should strictly look like this 0\n\nHere is the list of available tutors:\n";    const splitStrings = userPrompt.split(';');
    console.log(tutors0);
    const splitStrings1 = tutors0.split(';');
    const student_subject1= splitStrings1[0];
    const student_grade1= splitStrings1[1];
    console.log(student_subject1);
    console.log(student_grade1);
    console.log(splitStrings1);

    
    const tutors1 = await TutorProfile.find({
        subjects: student_subject1,
        grade_level: { $in: [parseInt(student_grade1)] },
      });
    console.log(tutors1.length);
    if(tutors1.length<1){
        return "0";
    }  
    const tutorsDetails = tutors1.map(tutor => {
        return `Name: ${tutor.name}, Subject: ${tutor.subjects}, grade_level: ${JSON.stringify(tutor.grade_level)}, Availability: ${JSON.stringify(tutor.slots)}`;
    }).join('\n');

    const instructionsWithTutors = systemInstructions + tutorsDetails;

    const messages = [
        { role: 'system', content: instructionsWithTutors },
        { role: 'user', content: userPrompt },
    ];

    console.log(messages);

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 250,
        });

        // Check if 'choices' array exists and has at least one element
        console.log(response);
        console.log("1");
        console.log(response.choices[0].message.content);
        console.log("2");
        //const messageObj = JSON.parse(response.choices[0].message.content);
        const messageObj1 = response.choices[0].message.content;
        // console.log(messageObj.subject);
        // console.log("2");
        if (messageObj1) {
            // Access the 'message' property of the first element in 'choices' array dynamically
            //const firstChoice = response.choices.message;
            //console.log(firstChoice);
            const extractedInformation = messageObj1;
            console.log(extractedInformation);

            if (extractedInformation) {
                return extractedInformation;
            }
        }

        console.error('Unexpected response format from OpenAI API:', response.choices);
        throw new Error('Failed to extract information from user prompt');

    } catch (error) {
        if (error.response && error.response.status === 429) {
            const retryAfter = parseInt(error.response.headers['retry-after']) || 60;
            console.log(`Rate limited. Waiting ${retryAfter} seconds and retrying...`);
            await delay(retryAfter * 1000);
            return generateTutorList(tutors, userPrompt);
        }
        console.error(error);
        throw new Error('Failed to extract information from user prompt');
    }
};



const generateFavoriteList = async (userPrompt) => {
    const systemInstructions = "You will be given a text with a list of tutors and scores and some other information. Your response should be strictly in this format ;tutorname,score;tutorname,score;. list all the tutors and their respective scores in this format";

    const messages = [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: userPrompt },
    ];

    console.log(messages);

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 250,
        });

        // Check if 'choices' array exists and has at least one element
        const messageObj1 = response.choices[0].message.content;

        if (messageObj1) {
            const extractedInformation = messageObj1;
            console.log(extractedInformation);

            if (extractedInformation) {
                return extractedInformation;
            }
        }

        console.error('Unexpected response format from OpenAI API:', response.choices);
        throw new Error('Failed to extract information from user prompt');

    } catch (error) {
        if (error.response && error.response.status === 429) {
            const retryAfter = parseInt(error.response.headers['retry-after']) || 60;
            console.log(`Rate limited. Waiting ${retryAfter} seconds and retrying...`);
            await delay(retryAfter * 1000);
            return generateTutorList(tutors, userPrompt);
        }
        console.error(error);
        throw new Error('Failed to extract information from user prompt');
    }
};

module.exports = { generateTutorList0, generateTutorList, generateFavoriteList };
