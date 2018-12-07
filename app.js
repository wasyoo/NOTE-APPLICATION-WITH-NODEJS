const fs = require("fs")

let note = []
const fileNote = 'note.json'

const grab = (flag) => {
    const index = process.argv.indexOf(flag)
    return (index === -1) ? null : process.argv[index + 1]  
}

const writeJsonFile = (file,json,msg=null) => {
    fs.writeFile(file, json, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            if (msg){
                process.stdout.write(msg +' \n')
            }
        }
    });
}

const readJsonFile = (file,action,obj,msg=null)=>{
    fs.readFile(file, 'utf8' ,
        (err, data) =>{ 
            if (err) {
                console.log(err);
            } else {
                
                note = JSON.parse(data);

                if (action === "add"){
                    note.push(obj);
                }

                else if(action === "remove"){
                    let noteExist = false
                    note = note.filter(el => {
                        if(el.title === obj.title){
                            noteExist = true 
                            return false
                        }else{
                            return true
                        }
                    });

                    if (!noteExist){
                        process.stdout.write("Note dosn't exist \n")
                    }else{
                        process.stdout.write("Note Deleted \n")
                    }
                }

                else if (action === "list"){
                    if (data){
                        note = JSON.parse(data);
                        process.stdout.write(`Printing ${note.length} note(s) \n`)
                        note.map(el => process.stdout.write(` -- \n Title : ${el.title} \n Body : ${el.body} \n\n`))
                    } else {
                        process.stdout.write(`Printing 0 note(s) \n`)
                    }
                }
                
                json = JSON.stringify(note);

                writeJsonFile(fileNote,json,msg)
            }
        });
}

const addNote = (title, body) => {

    fs.exists(fileNote, (exists) => {
        if (exists) {
            readJsonFile(fileNote,"add",{title,body},'Note created')
        } else {
            const json = JSON.stringify([{title,body}]);
            writeJsonFile(fileNote,json,'Note created')
        }
    })
}

const removeNote = (title) => {
    fs.exists(fileNote, (exists) => {
        if (exists) {
            readJsonFile(fileNote,"remove",{title})
        } else {
            process.stdout.write("Note dosn't exist \n")
        }
    })
}

const getNote= () => {
    fs.exists(fileNote, (exists) => {
        if (exists) {
            readJsonFile(fileNote,"list")
        } else {
            process.stdout.write(`Printing 0 note(s) \n`)
        }
    })
}

const showedHelp = (help) => {
    if (help === 'add') {
        process.stdout.write('Option: \n')
        process.stdout.write('--help: \t Show help \t \t \t [boolean] \n')
        process.stdout.write('--title: \t Title of Note \t \t \t [required] \n')
        process.stdout.write('--body: \t Body of Note \t \t \t [required] \n')
    }
    else if(help === 'remove'){
        process.stdout.write('Option: \n')
        process.stdout.write('--help: \t Show help \t \t \t [boolean] \n')
        process.stdout.write('--title: \t Title of Note \t \t \t [required] \n')
    }else {
        process.stdout.write('Option: \n')
        process.stdout.write('add:     \t add new note \n')
        process.stdout.write(' --help:  \t Show help \t \t \t [boolean] \n')
        process.stdout.write(' --title: \t Title of Note \t \t \t [required] \n')
        process.stdout.write(' --body:  \t Body of Note \t \t \t [required] \n')
        process.stdout.write('list:    \t List all the notes \n')
        process.stdout.write(' --help:  \t Show help \t \t \t [boolean] \n')
        process.stdout.write('remove:  \t Remove a note \n')
        process.stdout.write(' --help:  \t Show help \t \t \t [boolean] \n')
        process.stdout.write(' --title: \t Title of Note \t \t \t [required] \n')
    }
}

const getTitle=()=>{
    if (process.argv[3]==="--title"){
        return grab("--title") 
    }
     if (process.argv[3]==="-t"){
        return grab("-t") 
    }
    return ""
}

const getBody = ()=>{
    if (process.argv[5]==="--body"){
        return grab("--body")
    }else if(process.argv[5]==="-b"){
        return grab("-b") 
    }
    return ""
}

if (process.argv[2]==="add") {

    const title = getTitle()
    const body = getBody()

    if (title && body)
        addNote(title, body)
    else
        showedHelp('add')
} 

else if (process.argv[2]==="list") {
    getNote()
}

else if (process.argv[2]==="remove"){
    const title = getTitle()

    if(title)
        removeNote(title)
    else
        showedHelp('remove')
    
}

else {
    showedHelp()
}