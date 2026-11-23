// Auto-generated comprehensive Operating System study material data for Next.js

export interface QAItem {
  marks: string
  q: string
  a: string
}

export interface TopicData {
  id: string
  title: string
  html: string
  qas: QAItem[]
  hasCpuSim?: boolean
  hasBankerSim?: boolean
  hasPageSim?: boolean
  hasQuiz?: boolean
}

export interface UnitData {
  id: string
  number: number
  title: string
  desc: string
  topics: TopicData[]
  quiz: Array<{
    q: string
    o: string[]
    a: number
    exp?: string
  }>
}

export const OS_STUDY_UNITS: UnitData[] = [
  {
    "id": "u1",
    "number": 1,
    "title": "Unit 1: Introduction & Process Management",
    "desc": "OS types, structures, system calls, system boot, processes, threads, IPC, and CPU scheduling.",
    "topics": [
      {
        "id": "u1-intro",
        "title": "1.1 OS Definition aur Types",
        "html": "<h3>1.1 Operating System: Definition aur Types</h3>\r\n<div class=\"def\"><b class=\"t\">Definition</b>\r\nOperating System (OS) ek <b>system software</b> hai jo <b>computer hardware aur user ke beech interface</b> ka kaam karta hai. Ye hardware resources (CPU, memory, I/O, disk) ko manage karta hai aur application programs ko run karne ka environment deta hai.</div>\r\n\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 520 250\" width=\"520\">\r\n  <rect x=\"110\" y=\"10\" width=\"300\" height=\"42\" rx=\"8\" class=\"c3\"/><text x=\"260\" y=\"36\" text-anchor=\"middle\" class=\"b\">Users (Aap, Admin, Programs)</text>\r\n  <rect x=\"110\" y=\"66\" width=\"300\" height=\"42\" rx=\"8\" class=\"c4\"/><text x=\"260\" y=\"92\" text-anchor=\"middle\" class=\"b\">Application Software (Word, Chrome, Games)</text>\r\n  <rect x=\"110\" y=\"122\" width=\"300\" height=\"42\" rx=\"8\" class=\"c1\"/><text x=\"260\" y=\"148\" text-anchor=\"middle\" class=\"b\">Operating System (Kernel + Shell + Services)</text>\r\n  <rect x=\"110\" y=\"178\" width=\"300\" height=\"42\" rx=\"8\" class=\"c2\"/><text x=\"260\" y=\"204\" text-anchor=\"middle\" class=\"b\">Hardware (CPU, RAM, Disk, I/O Devices)</text>\r\n  <path d=\"M90 30 V200\" class=\"ar\"/><text x=\"20\" y=\"120\" class=\"mt\" font-size=\"12\">Request</text>\r\n</svg>\r\n<div class=\"cap\">Fig 1.1: Computer system ka layered view. OS beech mein \"manager\" hai.</div></div>\r\n\r\n<h4>OS ke Goals aur Functions</h4>\r\n<ul>\r\n<li><b>Convenience:</b> computer ko use karna aasaan banana.</li>\r\n<li><b>Efficiency:</b> hardware resources ka best use (CPU idle na rahe).</li>\r\n<li><b>Resource Manager:</b> CPU time, memory space, file storage, I/O devices ko programs mein baantna.</li>\r\n<li><b>Control Program:</b> programs ki galat/illegal activity rokna.</li>\r\n</ul>\r\n\r\n<h4>Types of Operating Systems</h4>\r\n<h5>1. Batch Operating System</h5>\r\n<p>Similar jobs ko ek <b>batch</b> mein jama karke operator computer ko ek saath dete hain. User aur computer ke beech <b>koi direct interaction nahi</b> hota.</p>\r\n<ul>\r\n<li><b>Fayde:</b> bade repetitive jobs ke liye acchha, CPU ka use better.</li>\r\n<li><b>Nuksan:</b> interactive nahi, ek job atak jaye to baaki wait karte hain, debugging mushkil, CPU idle hota hai jab job I/O mein hai.</li>\r\n<li><b>Example:</b> payroll, bank statements, IBM early mainframes.</li>\r\n</ul>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 620 110\" width=\"620\">\r\n  <rect x=\"5\" y=\"30\" width=\"90\" height=\"46\" rx=\"8\" class=\"c3\"/><text x=\"50\" y=\"58\" text-anchor=\"middle\" class=\"b\">Jobs (Cards)</text>\r\n  <path d=\"M95 53 H135\" class=\"ar\"/>\r\n  <rect x=\"140\" y=\"30\" width=\"110\" height=\"46\" rx=\"8\" class=\"c5\"/><text x=\"195\" y=\"58\" text-anchor=\"middle\" class=\"b\">Operator: Batch</text>\r\n  <path d=\"M250 53 H290\" class=\"ar\"/>\r\n  <rect x=\"295\" y=\"14\" width=\"150\" height=\"80\" rx=\"8\" class=\"c1\"/><text x=\"370\" y=\"40\" text-anchor=\"middle\" class=\"b\">Computer</text><text x=\"370\" y=\"62\" text-anchor=\"middle\" font-size=\"13\">Job1 → Job2 → Job3</text><text x=\"370\" y=\"80\" text-anchor=\"middle\" font-size=\"12\">(ek ke baad ek)</text>\r\n  <path d=\"M445 53 H485\" class=\"ar\"/>\r\n  <rect x=\"490\" y=\"30\" width=\"110\" height=\"46\" rx=\"8\" class=\"c2\"/><text x=\"545\" y=\"58\" text-anchor=\"middle\" class=\"b\">Output</text>\r\n</svg><div class=\"cap\">Fig 1.2: Batch system flow</div></div>\r\n\r\n<h5>2. Multiprogramming Operating System</h5>\r\n<p>Memory mein <b>ek se zyada programs</b> ek saath rakhe jate hain. Jab ek program I/O ke liye wait karta hai, CPU turant <b>dusre program</b> ko mil jata hai. Isse <b>CPU utilization</b> badhta hai.</p>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 520 200\" width=\"520\">\r\n  <rect x=\"40\" y=\"10\" width=\"140\" height=\"170\" fill=\"none\" class=\"ln\"/>\r\n  <rect x=\"40\" y=\"10\" width=\"140\" height=\"40\" class=\"c7\"/><text x=\"110\" y=\"35\" text-anchor=\"middle\" class=\"b\">Operating System</text>\r\n  <rect x=\"40\" y=\"50\" width=\"140\" height=\"40\" class=\"c1\"/><text x=\"110\" y=\"75\" text-anchor=\"middle\">Job 1 (Running)</text>\r\n  <rect x=\"40\" y=\"90\" width=\"140\" height=\"40\" class=\"c3\"/><text x=\"110\" y=\"115\" text-anchor=\"middle\">Job 2 (I/O wait)</text>\r\n  <rect x=\"40\" y=\"130\" width=\"140\" height=\"50\" class=\"c2\"/><text x=\"110\" y=\"160\" text-anchor=\"middle\">Job 3 (Ready)</text>\r\n  <text x=\"110\" y=\"196\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">Main Memory</text>\r\n  <path d=\"M180 70 H250\" class=\"ar\"/>\r\n  <rect x=\"255\" y=\"45\" width=\"100\" height=\"50\" rx=\"8\" class=\"c5\"/><text x=\"305\" y=\"75\" text-anchor=\"middle\" class=\"b\">CPU</text>\r\n  <text x=\"380\" y=\"62\" class=\"lt\" font-size=\"13\">CPU kabhi khali nahi:</text>\r\n  <text x=\"380\" y=\"82\" class=\"lt\" font-size=\"13\">Job1 I/O mein gaya to</text>\r\n  <text x=\"380\" y=\"102\" class=\"lt\" font-size=\"13\">CPU Job3 ko mil jayega</text>\r\n</svg><div class=\"cap\">Fig 1.3: Multiprogramming: memory mein multiple jobs</div></div>\r\n<div class=\"imp\"><b class=\"t\">Degree of Multiprogramming</b> = memory mein ek time par kitne processes hain. Zyada degree = CPU utilization zyada (ek limit tak, uske baad thrashing).</div>\r\n\r\n<h5>3. Time Sharing (Multitasking) Operating System</h5>\r\n<p>Multiprogramming ka <b>extension</b>. CPU time ko chhote <b>time slices (quantum)</b> mein baant kar har user/process ko baari-baari se diya jata hai. Itni tezi se switch hota hai ki har user ko lagta hai ki computer sirf usi ka hai. Isse <b>interactive computing</b> aur <b>fast response time</b> milta hai.</p>\r\n<ul><li>Example: UNIX, Linux, Windows. Scheduling: Round Robin.</li></ul>\r\n<table>\r\n<tr><th>Multiprogramming</th><th>Time Sharing</th></tr>\r\n<tr><td>Goal: CPU utilization maximize</td><td>Goal: response time minimize</td></tr>\r\n<tr><td>Switch tab hota hai jab process I/O ke liye wait kare</td><td>Switch timer interrupt (time quantum khatam) par hota hai</td></tr>\r\n<tr><td>Interactive nahi hona zaruri</td><td>Interactive hota hai</td></tr>\r\n</table>\r\n\r\n<h5>4. Parallel (Multiprocessor / Tightly Coupled) Systems</h5>\r\n<p>Ek hi computer mein <b>do ya zyada CPUs</b> hote hain jo <b>common memory aur bus</b> share karte hain. Isse <b>throughput</b> badhta hai, <b>reliability</b> badhti hai (ek CPU fail ho to doosra chalta hai: graceful degradation) aur economy of scale milti hai.</p>\r\n<ul>\r\n<li><b>Asymmetric Multiprocessing (AMP):</b> ek master CPU baaki slave CPUs ko kaam deta hai.</li>\r\n<li><b>Symmetric Multiprocessing (SMP):</b> sab CPUs barabar hain, har ek OS chala sakta hai. Modern systems (Linux, Windows) SMP use karte hain.</li>\r\n</ul>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 520 170\" width=\"520\">\r\n  <rect x=\"20\" y=\"15\" width=\"90\" height=\"40\" rx=\"6\" class=\"c1\"/><text x=\"65\" y=\"40\" text-anchor=\"middle\" class=\"b\">CPU 1</text>\r\n  <rect x=\"140\" y=\"15\" width=\"90\" height=\"40\" rx=\"6\" class=\"c1\"/><text x=\"185\" y=\"40\" text-anchor=\"middle\" class=\"b\">CPU 2</text>\r\n  <rect x=\"260\" y=\"15\" width=\"90\" height=\"40\" rx=\"6\" class=\"c1\"/><text x=\"305\" y=\"40\" text-anchor=\"middle\" class=\"b\">CPU 3</text>\r\n  <rect x=\"380\" y=\"15\" width=\"90\" height=\"40\" rx=\"6\" class=\"c1\"/><text x=\"425\" y=\"40\" text-anchor=\"middle\" class=\"b\">CPU n</text>\r\n  <path d=\"M65 55 V90 M185 55 V90 M305 55 V90 M425 55 V90\" class=\"ln\"/>\r\n  <rect x=\"10\" y=\"90\" width=\"480\" height=\"14\" rx=\"4\" class=\"c7\"/><text x=\"250\" y=\"101\" text-anchor=\"middle\" font-size=\"11\">System Bus</text>\r\n  <path d=\"M150 104 V125 M350 104 V125\" class=\"ln\"/>\r\n  <rect x=\"90\" y=\"125\" width=\"130\" height=\"38\" rx=\"6\" class=\"c2\"/><text x=\"155\" y=\"149\" text-anchor=\"middle\" class=\"b\">Shared Memory</text>\r\n  <rect x=\"290\" y=\"125\" width=\"130\" height=\"38\" rx=\"6\" class=\"c3\"/><text x=\"355\" y=\"149\" text-anchor=\"middle\" class=\"b\">I/O Devices</text>\r\n</svg><div class=\"cap\">Fig 1.4: Multiprocessor system (SMP)</div></div>\r\n\r\n<h5>5. Distributed Operating System (Loosely Coupled)</h5>\r\n<p>Alag-alag computers (nodes) <b>network</b> se jude hote hain. Har ka apna <b>memory aur clock</b> hota hai. User ko lagta hai ki wo ek hi system use kar raha hai (<b>transparency</b>). Resource sharing, load sharing, reliability aur speedup milte hain.</p>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 520 180\" width=\"520\">\r\n  <ellipse cx=\"260\" cy=\"90\" rx=\"90\" ry=\"30\" class=\"c7\"/><text x=\"260\" y=\"95\" text-anchor=\"middle\" class=\"b\">Network</text>\r\n  <rect x=\"20\" y=\"10\" width=\"110\" height=\"46\" rx=\"6\" class=\"c1\"/><text x=\"75\" y=\"38\" text-anchor=\"middle\">Site A (CPU+Mem)</text>\r\n  <rect x=\"390\" y=\"10\" width=\"110\" height=\"46\" rx=\"6\" class=\"c1\"/><text x=\"445\" y=\"38\" text-anchor=\"middle\">Site B (CPU+Mem)</text>\r\n  <rect x=\"20\" y=\"124\" width=\"110\" height=\"46\" rx=\"6\" class=\"c1\"/><text x=\"75\" y=\"152\" text-anchor=\"middle\">Site C (CPU+Mem)</text>\r\n  <rect x=\"390\" y=\"124\" width=\"110\" height=\"46\" rx=\"6\" class=\"c1\"/><text x=\"445\" y=\"152\" text-anchor=\"middle\">Site D (CPU+Mem)</text>\r\n  <path d=\"M130 40 L190 75 M390 40 L330 75 M130 140 L190 105 M390 140 L330 105\" class=\"ln\"/>\r\n</svg><div class=\"cap\">Fig 1.5: Distributed system: har site ki apni memory</div></div>\r\n<table>\r\n<tr><th>Parallel (Multiprocessor)</th><th>Distributed</th></tr>\r\n<tr><td>Shared memory, ek clock</td><td>Alag memory, alag clock</td></tr>\r\n<tr><td>Tightly coupled, bus se connected</td><td>Loosely coupled, network se connected</td></tr>\r\n<tr><td>Communication shared memory se (fast)</td><td>Communication message passing se (slow)</td></tr>\r\n<tr><td>Ek hi OS copy</td><td>Har node par OS, milkar ek system ki tarah</td></tr>\r\n</table>\r\n\r\n<h5>6. Real-Time Operating System (RTOS)</h5>\r\n<p>Jahan <b>deadline</b> bahut important hai. Result sirf sahi hona kaafi nahi, <b>time par</b> milna bhi zaruri hai.</p>\r\n<ul>\r\n<li><b>Hard Real-Time:</b> deadline miss = system failure. Example: pacemaker, airbag, missile control, ABS brakes.</li>\r\n<li><b>Soft Real-Time:</b> deadline miss ho to quality girti hai, system fail nahi. Example: video streaming, online gaming.</li>\r\n</ul>\r\n<p>Examples: VxWorks, QNX, FreeRTOS.</p>\r\n\r\n<h5>Other types (short)</h5>\r\n<ul>\r\n<li><b>Network OS:</b> network par file/printer sharing (Novell NetWare, Windows Server). Users ko pata hota hai ki dusre machines hain.</li>\r\n<li><b>Embedded / Mobile OS:</b> Android, iOS: limited resources.</li>\r\n</ul>\r\n<div class=\"exam\"><b class=\"t\">Exam Point</b> Types ko yaad rakhne ka trick: <b>B-M-T-P-D-R</b> (Batch, Multiprogramming, Time-sharing, Parallel, Distributed, Real-time).</div>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u1-structure",
        "title": "1.2 OS Structure",
        "html": "<h3>1.2 Operating System Structure</h3>\r\n<p>OS ek bahut bada program hai, isliye usko organize karne ke alag-alag tareeke hain.</p>\r\n<table>\r\n<tr><th>Structure</th><th>Idea</th><th>Fayda</th><th>Nuksan</th><th>Example</th></tr>\r\n<tr><td><b>Simple / Monolithic</b></td><td>Poora OS ek bada kernel program, sab services kernel mode mein</td><td>Fast (kam overhead)</td><td>Ek bug se poora system crash, maintain mushkil</td><td>MS-DOS, traditional UNIX, Linux (modular monolithic)</td></tr>\r\n<tr><td><b>Layered</b></td><td>OS ko layers (0 = hardware ... N = user interface) mein baanta. Har layer sirf neeche wali layer use karti hai</td><td>Debug aur verify aasaan</td><td>Layers define karna mushkil, performance kam</td><td>THE OS</td></tr>\r\n<tr><td><b>Microkernel</b></td><td>Kernel mein sirf minimum (IPC, basic memory, scheduling). Baaki (file system, drivers) <b>user space</b> mein servers</td><td>Secure, reliable, extend aasaan</td><td>User-kernel message passing se slow</td><td>Mach, QNX, Minix</td></tr>\r\n<tr><td><b>Modules</b></td><td>Core kernel + loadable modules runtime par load</td><td>Flexible</td><td>-</td><td>Linux, Solaris</td></tr>\r\n<tr><td><b>Hybrid</b></td><td>Monolithic + microkernel ka mix</td><td>Performance + modularity</td><td>-</td><td>Windows NT, macOS</td></tr>\r\n</table>\r\n\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 620 250\" width=\"620\">\r\n  <text x=\"150\" y=\"16\" text-anchor=\"middle\" class=\"b lt\">Layered Approach</text>\r\n  <rect x=\"40\" y=\"26\" width=\"220\" height=\"32\" class=\"c3\"/><text x=\"150\" y=\"47\" text-anchor=\"middle\">Layer N: User Interface</text>\r\n  <rect x=\"40\" y=\"58\" width=\"220\" height=\"32\" class=\"c4\"/><text x=\"150\" y=\"79\" text-anchor=\"middle\">Layer 3: I/O Management</text>\r\n  <rect x=\"40\" y=\"90\" width=\"220\" height=\"32\" class=\"c5\"/><text x=\"150\" y=\"111\" text-anchor=\"middle\">Layer 2: Memory Management</text>\r\n  <rect x=\"40\" y=\"122\" width=\"220\" height=\"32\" class=\"c1\"/><text x=\"150\" y=\"143\" text-anchor=\"middle\">Layer 1: CPU Scheduling</text>\r\n  <rect x=\"40\" y=\"154\" width=\"220\" height=\"32\" class=\"c2\"/><text x=\"150\" y=\"175\" text-anchor=\"middle\">Layer 0: Hardware</text>\r\n  <text x=\"470\" y=\"16\" text-anchor=\"middle\" class=\"b lt\">Microkernel Approach</text>\r\n  <rect x=\"330\" y=\"30\" width=\"80\" height=\"44\" class=\"c3\"/><text x=\"370\" y=\"57\" text-anchor=\"middle\" font-size=\"12\">Application</text>\r\n  <rect x=\"420\" y=\"30\" width=\"80\" height=\"44\" class=\"c4\"/><text x=\"460\" y=\"52\" text-anchor=\"middle\" font-size=\"11\">File System</text><text x=\"460\" y=\"66\" text-anchor=\"middle\" font-size=\"11\">Server</text>\r\n  <rect x=\"510\" y=\"30\" width=\"80\" height=\"44\" class=\"c5\"/><text x=\"550\" y=\"52\" text-anchor=\"middle\" font-size=\"11\">Device Driver</text><text x=\"550\" y=\"66\" text-anchor=\"middle\" font-size=\"11\">Server</text>\r\n  <text x=\"330\" y=\"94\" class=\"mt\" font-size=\"11\">User space</text>\r\n  <path d=\"M330 100 H600\" class=\"ln\" stroke-dasharray=\"5,4\"/>\r\n  <rect x=\"330\" y=\"112\" width=\"260\" height=\"46\" class=\"c1\"/><text x=\"460\" y=\"132\" text-anchor=\"middle\" class=\"b\">Microkernel</text><text x=\"460\" y=\"149\" text-anchor=\"middle\" font-size=\"12\">IPC + Memory + Scheduling</text>\r\n  <rect x=\"330\" y=\"168\" width=\"260\" height=\"30\" class=\"c2\"/><text x=\"460\" y=\"188\" text-anchor=\"middle\">Hardware</text>\r\n  <path d=\"M370 74 V112 M460 74 V112 M550 74 V112\" class=\"ar\"/>\r\n</svg><div class=\"cap\">Fig 1.6: Layered vs Microkernel structure</div></div>\r\n\r\n<h4>Virtual Machine</h4>\r\n<p>Ek physical machine par <b>kai virtual machines</b> chalana. Har VM ko lagta hai uska apna alag hardware hai. Software layer ko <b>hypervisor</b> kehte hain. Example: VMware, VirtualBox, Java Virtual Machine (JVM).</p>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u1-services",
        "title": "1.3 OS Components aur Services",
        "html": "<h3>1.3 Operating System Components aur Services</h3>\r\n<h4>OS ke Components</h4>\r\n<table>\r\n<tr><th>Component</th><th>Kaam</th></tr>\r\n<tr><td>Process Management</td><td>Process create/delete, suspend/resume, scheduling, synchronization, communication, deadlock handling</td></tr>\r\n<tr><td>Main Memory Management</td><td>Konsi memory kis process ko di hai track karna, allocate/deallocate</td></tr>\r\n<tr><td>File Management</td><td>Files/directories create, delete, read, write, access control</td></tr>\r\n<tr><td>I/O System Management</td><td>Device drivers, buffering, caching, spooling</td></tr>\r\n<tr><td>Secondary Storage Management</td><td>Free space management, disk scheduling, storage allocation</td></tr>\r\n<tr><td>Networking</td><td>Distributed system mein communication</td></tr>\r\n<tr><td>Protection System</td><td>Resources par access control (kaun kya use kar sakta hai)</td></tr>\r\n<tr><td>Command Interpreter (Shell)</td><td>User ke commands ko samajh kar OS se execute karwana</td></tr>\r\n</table>\r\n\r\n<h4>OS Services</h4>\r\n<div class=\"grid2\">\r\n<div class=\"box def\"><b class=\"t\">User ke liye</b>\r\n<ol><li><b>User Interface:</b> CLI, GUI, Batch</li><li><b>Program Execution:</b> program load, run, end</li><li><b>I/O Operations:</b> user seedha device nahi chalata, OS karta hai</li><li><b>File System Manipulation:</b> read/write/create/delete</li><li><b>Communication:</b> processes ke beech (shared memory / messages)</li><li><b>Error Detection:</b> CPU, memory, device, program errors</li></ol></div>\r\n<div class=\"box imp\"><b class=\"t\">System efficiency ke liye</b>\r\n<ol><li><b>Resource Allocation:</b> CPU cycles, memory, files</li><li><b>Accounting:</b> kisne kitna resource use kiya</li><li><b>Protection &amp; Security:</b> authentication, access control</li></ol></div>\r\n</div>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u1-syscall",
        "title": "1.4 System Calls, System Programs, Boot",
        "html": "<h3>1.4 System Calls, System Programs aur System Boot</h3>\r\n<div class=\"def\"><b class=\"t\">System Call</b>\r\nSystem call ek <b>interface</b> hai jiske through user program <b>OS (kernel) se service request</b> karta hai. Ye user mode se kernel mode mein jaane ka <b>controlled tareeka</b> hai.</div>\r\n\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 620 130\" width=\"620\">\r\n  <rect x=\"5\" y=\"30\" width=\"120\" height=\"50\" rx=\"8\" class=\"c3\"/><text x=\"65\" y=\"52\" text-anchor=\"middle\" class=\"b\">User Program</text><text x=\"65\" y=\"68\" text-anchor=\"middle\" font-size=\"12\">printf(\"Hi\")</text>\r\n  <path d=\"M125 55 H165\" class=\"ar\"/>\r\n  <rect x=\"170\" y=\"30\" width=\"110\" height=\"50\" rx=\"8\" class=\"c5\"/><text x=\"225\" y=\"52\" text-anchor=\"middle\" class=\"b\">Library</text><text x=\"225\" y=\"68\" text-anchor=\"middle\" font-size=\"12\">C library (libc)</text>\r\n  <path d=\"M280 55 H320\" class=\"ar\"/>\r\n  <rect x=\"325\" y=\"30\" width=\"120\" height=\"50\" rx=\"8\" class=\"c1\"/><text x=\"385\" y=\"52\" text-anchor=\"middle\" class=\"b\">System Call</text><text x=\"385\" y=\"68\" text-anchor=\"middle\" font-size=\"12\">write()  [TRAP]</text>\r\n  <path d=\"M445 55 H485\" class=\"ar\"/>\r\n  <rect x=\"490\" y=\"30\" width=\"120\" height=\"50\" rx=\"8\" class=\"c2\"/><text x=\"550\" y=\"52\" text-anchor=\"middle\" class=\"b\">Kernel</text><text x=\"550\" y=\"68\" text-anchor=\"middle\" font-size=\"12\">Hardware access</text>\r\n  <text x=\"65\" y=\"105\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">User Mode</text>\r\n  <text x=\"550\" y=\"105\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">Kernel Mode</text>\r\n</svg><div class=\"cap\">Fig 1.7: System call flow (user mode → kernel mode)</div></div>\r\n\r\n<h4>Dual Mode Operation</h4>\r\n<p>Hardware ek <b>mode bit</b> rakhta hai: <b>User mode (1)</b> aur <b>Kernel/Supervisor mode (0)</b>. Privileged instructions (I/O, memory management) sirf kernel mode mein chalti hain. System call karne par mode kernel mein badalta hai, kaam ke baad wapas user mode.</p>\r\n\r\n<h4>Types of System Calls</h4>\r\n<table>\r\n<tr><th>Category</th><th>Kaam</th><th>UNIX / Linux</th><th>Windows</th></tr>\r\n<tr><td>Process Control</td><td>process banana, khatam karna, wait</td><td>fork(), exec(), exit(), wait()</td><td>CreateProcess(), ExitProcess(), WaitForSingleObject()</td></tr>\r\n<tr><td>File Management</td><td>file create/open/read/write/close</td><td>open(), read(), write(), close()</td><td>CreateFile(), ReadFile(), WriteFile(), CloseHandle()</td></tr>\r\n<tr><td>Device Management</td><td>device request/release, read/write</td><td>ioctl(), read(), write()</td><td>SetConsoleMode(), ReadConsole()</td></tr>\r\n<tr><td>Information Maintenance</td><td>time, date, process attributes</td><td>getpid(), alarm(), sleep()</td><td>GetCurrentProcessID(), Sleep()</td></tr>\r\n<tr><td>Communication</td><td>pipe, shared memory, messages</td><td>pipe(), shmget(), mmap()</td><td>CreatePipe(), CreateFileMapping()</td></tr>\r\n<tr><td>Protection</td><td>permissions set/get</td><td>chmod(), umask(), chown()</td><td>SetFileSecurity()</td></tr>\r\n</table>\r\n\r\n<h4>Parameter Passing ke 3 Tareeke</h4>\r\n<ol>\r\n<li><b>Registers</b> mein parameters rakhna (sabse fast, par limited).</li>\r\n<li>Memory mein <b>table/block</b> mein rakho, uska <b>address register</b> mein do (Linux, Solaris).</li>\r\n<li><b>Stack</b> par push karo, OS pop karega.</li>\r\n</ol>\r\n\r\n<h4>System Programs</h4>\r\n<p>System programs (utilities) OS ke upar chalte hain aur user ko convenient environment dete hain. Ye system calls ka bundle ya wrapper hote hain.</p>\r\n<ul>\r\n<li><b>File management:</b> cp, mv, rm, ls</li>\r\n<li><b>Status information:</b> date, df, top</li>\r\n<li><b>File modification:</b> text editors (vi, nano)</li>\r\n<li><b>Programming language support:</b> compiler, assembler, debugger</li>\r\n<li><b>Program loading &amp; execution:</b> loader, linker</li>\r\n<li><b>Communication:</b> mail, ssh, ftp</li>\r\n<li><b>Background services:</b> daemons (cron, sshd)</li>\r\n</ul>\r\n\r\n<h4>System Boot (Booting Process)</h4>\r\n<div class=\"def\"><b class=\"t\">Booting</b> Computer ON hone par OS ko <b>secondary memory (disk) se RAM mein load</b> karne ki process.</div>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 640 250\" width=\"640\">\r\n  <rect x=\"10\" y=\"10\" width=\"140\" height=\"44\" rx=\"8\" class=\"c3\"/><text x=\"80\" y=\"37\" text-anchor=\"middle\" class=\"b\">1. Power ON</text>\r\n  <path d=\"M150 32 H175\" class=\"ar\"/>\r\n  <rect x=\"180\" y=\"10\" width=\"140\" height=\"44\" rx=\"8\" class=\"c1\"/><text x=\"250\" y=\"37\" text-anchor=\"middle\" class=\"b\">2. POST</text>\r\n  <path d=\"M320 32 H345\" class=\"ar\"/>\r\n  <rect x=\"350\" y=\"10\" width=\"140\" height=\"44\" rx=\"8\" class=\"c1\"/><text x=\"420\" y=\"37\" text-anchor=\"middle\" class=\"b\">3. BIOS / UEFI</text>\r\n  <path d=\"M490 32 H515\" class=\"ar\"/>\r\n  <rect x=\"520\" y=\"10\" width=\"110\" height=\"44\" rx=\"8\" class=\"c5\"/><text x=\"575\" y=\"37\" text-anchor=\"middle\" class=\"b\">4. Boot Loader</text>\r\n  <path d=\"M575 54 V90 H80 V110\" class=\"ar\"/>\r\n  <rect x=\"10\" y=\"112\" width=\"140\" height=\"44\" rx=\"8\" class=\"c5\"/><text x=\"80\" y=\"139\" text-anchor=\"middle\" class=\"b\">5. Kernel Load</text>\r\n  <path d=\"M150 134 H175\" class=\"ar\"/>\r\n  <rect x=\"180\" y=\"112\" width=\"140\" height=\"44\" rx=\"8\" class=\"c2\"/><text x=\"250\" y=\"139\" text-anchor=\"middle\" class=\"b\">6. Kernel Init</text>\r\n  <path d=\"M320 134 H345\" class=\"ar\"/>\r\n  <rect x=\"350\" y=\"112\" width=\"140\" height=\"44\" rx=\"8\" class=\"c2\"/><text x=\"420\" y=\"139\" text-anchor=\"middle\" class=\"b\">7. Services Start</text>\r\n  <path d=\"M490 134 H515\" class=\"ar\"/>\r\n  <rect x=\"520\" y=\"112\" width=\"110\" height=\"44\" rx=\"8\" class=\"c4\"/><text x=\"575\" y=\"139\" text-anchor=\"middle\" class=\"b\">8. Login</text>\r\n  <text x=\"320\" y=\"190\" text-anchor=\"middle\" class=\"lt\" font-size=\"13\">ROM (BIOS) → MBR (Master Boot Record) → Boot Loader (GRUB) → Kernel (RAM mein)</text>\r\n  <text x=\"320\" y=\"212\" text-anchor=\"middle\" class=\"mt\" font-size=\"12\">RAM volatile hai, isliye OS ko har baar disk se load karna padta hai</text>\r\n</svg><div class=\"cap\">Fig 1.8: System boot ke steps</div></div>\r\n<ol>\r\n<li><b>Power ON:</b> power supply CPU ko chalu karti hai. CPU ROM ke fixed address se firmware chalata hai.</li>\r\n<li><b>POST (Power-On Self Test):</b> BIOS RAM, keyboard, disk, etc. check karta hai. Problem ho to beep ya error.</li>\r\n<li><b>BIOS/UEFI execute:</b> hardware initialize aur boot device (disk/USB) dhundhta hai. UEFI = modern, fast, bade disks (GPT) support.</li>\r\n<li><b>Boot Loader load:</b> boot device ka pehla sector <b>MBR</b> RAM mein aata hai. Boot loader (GRUB, Windows Boot Manager) OS ki location jaanta hai.</li>\r\n<li><b>Kernel load:</b> kernel disk se RAM mein copy hota hai.</li>\r\n<li><b>Kernel initialization:</b> memory, process, I/O management shuru.</li>\r\n<li><b>System services (daemons)</b> start ho jaati hain (init/systemd).</li>\r\n<li><b>Login screen</b> aata hai.</li>\r\n</ol>\r\n<div class=\"imp\"><b class=\"t\">Bootstrap program</b> ROM/EEPROM mein stored chhota program (firmware) jo kernel ko dhundh kar load karta hai. Isi ko \"bootstrapping\" kehte hain.</div>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u1-process",
        "title": "1.5 Process Concept aur Scheduling",
        "html": "<h3>1.5 Process Concept aur Process Scheduling</h3>\r\n<div class=\"def\"><b class=\"t\">Process</b> Process ek <b>executing program</b> hai. Program disk par padi hui <b>passive</b> file hai, jab usse memory mein load karke run karte hain to wo <b>active entity (process)</b> ban jata hai.</div>\r\n<table>\r\n<tr><th>Program</th><th>Process</th></tr>\r\n<tr><td>Passive (file on disk)</td><td>Active (memory mein, CPU use karta hai)</td></tr>\r\n<tr><td>Static, lifetime lambi</td><td>Dynamic, lifetime limited</td></tr>\r\n<tr><td>Ek program ke kai processes ban sakte hain (Chrome ke multiple tabs)</td><td>Har process ka apna PCB, address space</td></tr>\r\n</table>\r\n\r\n<h4>Process ka Memory Layout</h4>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 470 260\" width=\"470\">\r\n  <rect x=\"120\" y=\"10\" width=\"140\" height=\"42\" class=\"c3\"/><text x=\"190\" y=\"36\" text-anchor=\"middle\" class=\"b\">Stack</text>\r\n  <path d=\"M190 52 V82\" class=\"ar\"/>\r\n  <rect x=\"120\" y=\"86\" width=\"140\" height=\"40\" fill=\"none\" class=\"ln\" stroke-dasharray=\"4,4\"/><text x=\"190\" y=\"111\" text-anchor=\"middle\" class=\"mt\" font-size=\"12\">(free space)</text>\r\n  <path d=\"M190 160 V130\" class=\"ar\"/>\r\n  <rect x=\"120\" y=\"164\" width=\"140\" height=\"34\" class=\"c4\"/><text x=\"190\" y=\"186\" text-anchor=\"middle\" class=\"b\">Heap</text>\r\n  <rect x=\"120\" y=\"198\" width=\"140\" height=\"28\" class=\"c1\"/><text x=\"190\" y=\"217\" text-anchor=\"middle\" class=\"b\">Data</text>\r\n  <rect x=\"120\" y=\"226\" width=\"140\" height=\"28\" class=\"c2\"/><text x=\"190\" y=\"245\" text-anchor=\"middle\" class=\"b\">Text (Code)</text>\r\n  <text x=\"275\" y=\"35\" class=\"lt\" font-size=\"12\">Function calls, local variables</text>\r\n  <text x=\"275\" y=\"182\" class=\"lt\" font-size=\"12\">Dynamic memory (malloc/new)</text>\r\n  <text x=\"275\" y=\"214\" class=\"lt\" font-size=\"12\">Global &amp; static variables</text>\r\n  <text x=\"275\" y=\"242\" class=\"lt\" font-size=\"12\">Program ke instructions</text>\r\n  <text x=\"10\" y=\"24\" class=\"mt\" font-size=\"11\">High address</text><text x=\"10\" y=\"254\" class=\"mt\" font-size=\"11\">Low address</text>\r\n</svg><div class=\"cap\">Fig 1.9: Process in memory</div></div>\r\n\r\n<h4>Process States</h4>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 730 290\" width=\"730\">\r\n  <rect x=\"10\" y=\"75\" width=\"110\" height=\"50\" rx=\"12\" class=\"c7\"/><text x=\"65\" y=\"105\" text-anchor=\"middle\" class=\"b\">New</text>\r\n  <rect x=\"210\" y=\"75\" width=\"110\" height=\"50\" rx=\"12\" class=\"c1\"/><text x=\"265\" y=\"105\" text-anchor=\"middle\" class=\"b\">Ready</text>\r\n  <rect x=\"420\" y=\"75\" width=\"110\" height=\"50\" rx=\"12\" class=\"c2\"/><text x=\"475\" y=\"105\" text-anchor=\"middle\" class=\"b\">Running</text>\r\n  <rect x=\"610\" y=\"75\" width=\"110\" height=\"50\" rx=\"12\" class=\"c6\"/><text x=\"665\" y=\"105\" text-anchor=\"middle\" class=\"b\">Terminated</text>\r\n  <rect x=\"315\" y=\"205\" width=\"110\" height=\"50\" rx=\"12\" class=\"c3\"/><text x=\"370\" y=\"235\" text-anchor=\"middle\" class=\"b\">Waiting</text>\r\n  <path d=\"M120 100 H208\" class=\"ar\"/><text x=\"164\" y=\"92\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">admitted</text>\r\n  <path d=\"M320 108 H418\" class=\"ar\"/><text x=\"369\" y=\"125\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">dispatch</text>\r\n  <path d=\"M475 75 C475 15 265 15 265 73\" class=\"ar\"/><text x=\"370\" y=\"22\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">interrupt / time-out (preempt)</text>\r\n  <path d=\"M530 100 H608\" class=\"ar\"/><text x=\"569\" y=\"92\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">exit</text>\r\n  <path d=\"M455 126 L400 203\" class=\"ar\"/><text x=\"470\" y=\"175\" class=\"lt\" font-size=\"12\">I/O or event wait</text>\r\n  <path d=\"M335 203 L275 128\" class=\"ar\"/><text x=\"110\" y=\"180\" class=\"lt\" font-size=\"12\">I/O or event completion</text>\r\n</svg><div class=\"cap\">Fig 1.10: Process state diagram</div></div>\r\n<ul>\r\n<li><b>New:</b> process ban raha hai.</li>\r\n<li><b>Ready:</b> memory mein hai, CPU ka wait kar raha hai.</li>\r\n<li><b>Running:</b> CPU par instructions execute ho rahi hain (ek CPU par ek time par ek hi process).</li>\r\n<li><b>Waiting (Blocked):</b> kisi event (I/O complete) ka intezaar.</li>\r\n<li><b>Terminated:</b> execution khatam.</li>\r\n</ul>\r\n\r\n<h4>Process Control Block (PCB)</h4>\r\n<p>OS har process ke liye ek <b>PCB (Task Control Block)</b> rakhta hai jisme process ki saari info hoti hai.</p>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 260 230\" width=\"260\">\r\n  <rect x=\"40\" y=\"5\" width=\"180\" height=\"32\" class=\"c1\"/><text x=\"130\" y=\"26\" text-anchor=\"middle\">Process State</text>\r\n  <rect x=\"40\" y=\"37\" width=\"180\" height=\"32\" class=\"c1\"/><text x=\"130\" y=\"58\" text-anchor=\"middle\">Process ID (PID)</text>\r\n  <rect x=\"40\" y=\"69\" width=\"180\" height=\"32\" class=\"c1\"/><text x=\"130\" y=\"90\" text-anchor=\"middle\">Program Counter</text>\r\n  <rect x=\"40\" y=\"101\" width=\"180\" height=\"32\" class=\"c1\"/><text x=\"130\" y=\"122\" text-anchor=\"middle\">CPU Registers</text>\r\n  <rect x=\"40\" y=\"133\" width=\"180\" height=\"32\" class=\"c1\"/><text x=\"130\" y=\"154\" text-anchor=\"middle\">CPU Scheduling Info (priority)</text>\r\n  <rect x=\"40\" y=\"165\" width=\"180\" height=\"32\" class=\"c1\"/><text x=\"130\" y=\"186\" text-anchor=\"middle\">Memory Mgmt Info (page table)</text>\r\n  <rect x=\"40\" y=\"197\" width=\"180\" height=\"32\" class=\"c1\"/><text x=\"130\" y=\"218\" text-anchor=\"middle\">Accounting + I/O Status Info</text>\r\n</svg><div class=\"cap\">Fig 1.11: PCB ke fields</div></div>\r\n\r\n<h4>Context Switch</h4>\r\n<p>CPU ko ek process se doosre process par dena. OS purane process ka state (registers, PC) uske <b>PCB mein save</b> karta hai aur naye process ka state <b>PCB se load</b> karta hai. Context switch <b>pure overhead</b> hai (is time koi useful kaam nahi hota), isliye jitna kam utna acchha.</p>\r\n\r\n<h4>Process Scheduling Queues</h4>\r\n<ul>\r\n<li><b>Job queue:</b> system ke saare processes.</li>\r\n<li><b>Ready queue:</b> main memory mein, run hone ko ready.</li>\r\n<li><b>Device (I/O) queues:</b> kisi I/O device ka wait karne wale.</li>\r\n</ul>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 640 190\" width=\"640\">\r\n  <rect x=\"20\" y=\"40\" width=\"190\" height=\"34\" class=\"c1\"/><text x=\"115\" y=\"62\" text-anchor=\"middle\">Ready Queue: P3 P5 P7</text>\r\n  <path d=\"M210 57 H265\" class=\"ar\"/>\r\n  <circle cx=\"310\" cy=\"57\" r=\"40\" class=\"c2\"/><text x=\"310\" y=\"62\" text-anchor=\"middle\" class=\"b\">CPU</text>\r\n  <path d=\"M350 57 H420\" class=\"ar\"/><text x=\"460\" y=\"62\" class=\"lt\">Exit</text>\r\n  <path d=\"M310 97 V140 H115 V76\" class=\"ar\"/><text x=\"212\" y=\"134\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">time slice expire</text>\r\n  <path d=\"M330 95 V120 H520 V160\" class=\"ar\"/>\r\n  <rect x=\"440\" y=\"160\" width=\"160\" height=\"28\" class=\"c3\"/><text x=\"520\" y=\"179\" text-anchor=\"middle\" font-size=\"13\">I/O Queue (Disk, Printer)</text>\r\n  <path d=\"M440 174 H30 V76\" class=\"ar\"/><text x=\"236\" y=\"168\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">I/O complete → wapas Ready</text>\r\n</svg><div class=\"cap\">Fig 1.12: Queuing diagram</div></div>\r\n\r\n<h4>Schedulers</h4>\r\n<table>\r\n<tr><th>Scheduler</th><th>Kaam</th><th>Speed</th><th>Control</th></tr>\r\n<tr><td><b>Long-term (Job)</b></td><td>Disk ke job pool se processes ko memory (ready queue) mein laata hai</td><td>Slow (seconds/minutes)</td><td>Degree of multiprogramming; I/O-bound aur CPU-bound ka mix</td></tr>\r\n<tr><td><b>Short-term (CPU)</b></td><td>Ready queue se ek process chun kar CPU deta hai</td><td>Bahut fast (ms)</td><td>Next process kaun</td></tr>\r\n<tr><td><b>Medium-term</b></td><td>Process ko memory se bahar nikalta (swap out) aur baad mein wapas (swap in)</td><td>Beech ka</td><td>Memory pressure kam karna</td></tr>\r\n</table>\r\n<p><b>Dispatcher:</b> wo module jo short-term scheduler ke chune hue process ko CPU deta hai (context switch, user mode switch, jump). Dispatch time = <b>dispatch latency</b>.</p>\r\n<p><b>CPU-bound</b> process zyada computation karta hai; <b>I/O-bound</b> zyada waqt I/O mein bitata hai.</p>\r\n\r\n<h4>Operations on Processes</h4>\r\n<ul>\r\n<li><b>Process Creation:</b> parent process child banata hai (UNIX: <code>fork()</code>), process tree banta hai.</li>\r\n<li><b>Termination:</b> <code>exit()</code>; parent <code>wait()</code> se child ka status leta hai.</li>\r\n</ul>\r\n<pre><code>pid_t pid = fork();\r\nif (pid == 0)      printf(\"Main child hoon\\n\");   // child\r\nelse if (pid > 0)  { wait(NULL); printf(\"Child khatam\\n\"); }  // parent\r\nelse               perror(\"fork failed\");</code></pre>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u1-ipc",
        "title": "1.6 Cooperating Process aur IPC",
        "html": "<h3>1.6 Cooperating Process aur Interprocess Communication (IPC)</h3>\r\n<ul>\r\n<li><b>Independent process:</b> doosre process ko affect/affected nahi karta.</li>\r\n<li><b>Cooperating process:</b> doosre processes ko affect kar sakta hai ya unse affect hota hai (data share karta hai).</li>\r\n</ul>\r\n<p><b>Cooperation kyun?</b> Information sharing, computation speedup, modularity, convenience.</p>\r\n<div class=\"def\"><b class=\"t\">IPC</b> Cooperating processes ko aapas mein data exchange karne ka mechanism. Do models: <b>Shared Memory</b> aur <b>Message Passing</b>.</div>\r\n\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 640 210\" width=\"640\">\r\n  <text x=\"150\" y=\"16\" text-anchor=\"middle\" class=\"b lt\">(a) Shared Memory</text>\r\n  <rect x=\"20\" y=\"30\" width=\"80\" height=\"40\" class=\"c3\"/><text x=\"60\" y=\"55\" text-anchor=\"middle\">Process A</text>\r\n  <rect x=\"200\" y=\"30\" width=\"80\" height=\"40\" class=\"c3\"/><text x=\"240\" y=\"55\" text-anchor=\"middle\">Process B</text>\r\n  <rect x=\"100\" y=\"95\" width=\"100\" height=\"36\" class=\"c2\"/><text x=\"150\" y=\"118\" text-anchor=\"middle\" class=\"b\">Shared Mem</text>\r\n  <path d=\"M60 70 L110 95 M240 70 L190 95\" class=\"ar\"/>\r\n  <rect x=\"20\" y=\"150\" width=\"260\" height=\"36\" class=\"c7\"/><text x=\"150\" y=\"173\" text-anchor=\"middle\">Kernel</text>\r\n  <text x=\"470\" y=\"16\" text-anchor=\"middle\" class=\"b lt\">(b) Message Passing</text>\r\n  <rect x=\"340\" y=\"30\" width=\"80\" height=\"40\" class=\"c3\"/><text x=\"380\" y=\"55\" text-anchor=\"middle\">Process A</text>\r\n  <rect x=\"520\" y=\"30\" width=\"80\" height=\"40\" class=\"c3\"/><text x=\"560\" y=\"55\" text-anchor=\"middle\">Process B</text>\r\n  <rect x=\"340\" y=\"150\" width=\"260\" height=\"36\" class=\"c1\"/><text x=\"470\" y=\"173\" text-anchor=\"middle\" class=\"b\">Kernel: Message Queue (M)</text>\r\n  <path d=\"M380 70 V148\" class=\"ar\"/><text x=\"400\" y=\"115\" class=\"lt\" font-size=\"12\">send(M)</text>\r\n  <path d=\"M560 148 V72\" class=\"ar\"/><text x=\"500\" y=\"115\" class=\"lt\" font-size=\"12\">receive(M)</text>\r\n</svg><div class=\"cap\">Fig 1.13: IPC ke do models</div></div>\r\n\r\n<table>\r\n<tr><th>Shared Memory</th><th>Message Passing</th></tr>\r\n<tr><td>Memory ka region share hota hai</td><td>Messages send/receive hote hain</td></tr>\r\n<tr><td>Fast (system call sirf setup par)</td><td>Slow (har message par kernel)</td></tr>\r\n<tr><td>Synchronization khud programmer ko karna</td><td>Kernel handle karta hai, chhote data/distributed ke liye achha</td></tr>\r\n<tr><td>Same machine</td><td>Network par bhi chalta hai</td></tr>\r\n</table>\r\n\r\n<h4>Message Passing ki details</h4>\r\n<ul>\r\n<li><b>Operations:</b> <code>send(P, msg)</code>, <code>receive(Q, msg)</code></li>\r\n<li><b>Direct communication:</b> process ka naam likhte hain (send(P, m)). Link auto banta hai, do processes ke beech ek hi link.</li>\r\n<li><b>Indirect communication:</b> <b>mailbox / port</b> ke through. Ek mailbox kai processes share kar sakte hain.</li>\r\n<li><b>Synchronous (blocking):</b> sender/receiver wait karte hain. <b>Asynchronous (non-blocking):</b> turant return.</li>\r\n<li><b>Buffering:</b> zero capacity, bounded capacity, unbounded capacity queue.</li>\r\n</ul>\r\n<p><b>Other IPC:</b> Pipes (ordinary / named FIFO), Sockets, RPC, Signals.</p>\r\n<div class=\"ex\"><b class=\"t\">Producer-Consumer Example</b> Producer data banata hai, consumer use karta hai. Beech mein <b>bounded buffer</b> hota hai: buffer full ho to producer wait kare, empty ho to consumer wait kare. (Iska synchronization Unit 2 mein dekhenge.)</div>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u1-threads",
        "title": "1.7 Threads",
        "html": "<h3>1.7 Threads</h3>\r\n<div class=\"def\"><b class=\"t\">Thread</b> Thread CPU utilization ki <b>basic unit</b> hai (lightweight process). Ek process ke andar multiple threads ho sakte hain jo <b>code, data, files</b> share karte hain, par har thread ka apna <b>thread ID, program counter, registers, stack</b> hota hai.</div>\r\n\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 560 220\" width=\"560\">\r\n  <text x=\"130\" y=\"16\" text-anchor=\"middle\" class=\"b lt\">Single-threaded process</text>\r\n  <rect x=\"20\" y=\"26\" width=\"220\" height=\"30\" class=\"c1\"/><text x=\"130\" y=\"46\" text-anchor=\"middle\">Code | Data | Files</text>\r\n  <rect x=\"20\" y=\"56\" width=\"220\" height=\"26\" class=\"c3\"/><text x=\"130\" y=\"74\" text-anchor=\"middle\" font-size=\"13\">Registers | Stack | PC</text>\r\n  <text x=\"130\" y=\"105\" text-anchor=\"middle\" class=\"lt\" font-size=\"13\">1 thread of control</text>\r\n  <text x=\"420\" y=\"16\" text-anchor=\"middle\" class=\"b lt\">Multithreaded process</text>\r\n  <rect x=\"300\" y=\"26\" width=\"240\" height=\"30\" class=\"c1\"/><text x=\"420\" y=\"46\" text-anchor=\"middle\">Code | Data | Files (shared)</text>\r\n  <rect x=\"300\" y=\"56\" width=\"76\" height=\"60\" class=\"c3\"/><text x=\"338\" y=\"80\" text-anchor=\"middle\" font-size=\"12\">Thread 1</text><text x=\"338\" y=\"98\" text-anchor=\"middle\" font-size=\"11\">Reg+Stack</text>\r\n  <rect x=\"380\" y=\"56\" width=\"76\" height=\"60\" class=\"c4\"/><text x=\"418\" y=\"80\" text-anchor=\"middle\" font-size=\"12\">Thread 2</text><text x=\"418\" y=\"98\" text-anchor=\"middle\" font-size=\"11\">Reg+Stack</text>\r\n  <rect x=\"460\" y=\"56\" width=\"80\" height=\"60\" class=\"c5\"/><text x=\"500\" y=\"80\" text-anchor=\"middle\" font-size=\"12\">Thread 3</text><text x=\"500\" y=\"98\" text-anchor=\"middle\" font-size=\"11\">Reg+Stack</text>\r\n</svg><div class=\"cap\">Fig 1.14: Single vs multithreaded process</div></div>\r\n\r\n<h4>Benefits</h4>\r\n<ul><li><b>Responsiveness:</b> ek thread block ho to baaki chalte hain (UI + background).</li><li><b>Resource sharing</b> by default.</li><li><b>Economy:</b> thread create/context switch process se sasta.</li><li><b>Scalability:</b> multiple CPUs par parallel.</li></ul>\r\n\r\n<h4>User-level vs Kernel-level Threads</h4>\r\n<table>\r\n<tr><th></th><th>User-Level Thread (ULT)</th><th>Kernel-Level Thread (KLT)</th></tr>\r\n<tr><td>Manage kaun karta</td><td>User library</td><td>Kernel (OS)</td></tr>\r\n<tr><td>Speed</td><td>Fast create/switch</td><td>Slow (kernel involvement)</td></tr>\r\n<tr><td>Blocking system call</td><td>Poora process block ho jata hai</td><td>Sirf wahi thread block</td></tr>\r\n<tr><td>Multiprocessor</td><td>Fayda nahi utha sakta</td><td>Parallel chal sakte hain</td></tr>\r\n<tr><td>Example</td><td>POSIX Pthreads (user lib), Green threads</td><td>Windows, Linux threads</td></tr>\r\n</table>\r\n\r\n<h4>Multithreading Models</h4>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 640 200\" width=\"640\">\r\n  <text x=\"105\" y=\"14\" text-anchor=\"middle\" class=\"b lt\" font-size=\"14\">Many-to-One</text>\r\n  <circle cx=\"50\" cy=\"45\" r=\"12\" class=\"c3\"/><circle cx=\"105\" cy=\"45\" r=\"12\" class=\"c3\"/><circle cx=\"160\" cy=\"45\" r=\"12\" class=\"c3\"/>\r\n  <rect x=\"85\" y=\"140\" width=\"40\" height=\"30\" class=\"c1\"/>\r\n  <path d=\"M50 57 L100 140 M105 57 V140 M160 57 L110 140\" class=\"ln\"/>\r\n  <text x=\"105\" y=\"190\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">Kai user → 1 kernel</text>\r\n  <text x=\"320\" y=\"14\" text-anchor=\"middle\" class=\"b lt\" font-size=\"14\">One-to-One</text>\r\n  <circle cx=\"265\" cy=\"45\" r=\"12\" class=\"c3\"/><circle cx=\"320\" cy=\"45\" r=\"12\" class=\"c3\"/><circle cx=\"375\" cy=\"45\" r=\"12\" class=\"c3\"/>\r\n  <rect x=\"245\" y=\"140\" width=\"40\" height=\"30\" class=\"c1\"/><rect x=\"300\" y=\"140\" width=\"40\" height=\"30\" class=\"c1\"/><rect x=\"355\" y=\"140\" width=\"40\" height=\"30\" class=\"c1\"/>\r\n  <path d=\"M265 57 V140 M320 57 V140 M375 57 V140\" class=\"ln\"/>\r\n  <text x=\"320\" y=\"190\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">Har user → 1 kernel</text>\r\n  <text x=\"535\" y=\"14\" text-anchor=\"middle\" class=\"b lt\" font-size=\"14\">Many-to-Many</text>\r\n  <circle cx=\"480\" cy=\"45\" r=\"12\" class=\"c3\"/><circle cx=\"535\" cy=\"45\" r=\"12\" class=\"c3\"/><circle cx=\"590\" cy=\"45\" r=\"12\" class=\"c3\"/>\r\n  <rect x=\"495\" y=\"140\" width=\"40\" height=\"30\" class=\"c1\"/><rect x=\"545\" y=\"140\" width=\"40\" height=\"30\" class=\"c1\"/>\r\n  <path d=\"M480 57 L510 140 M535 57 L510 140 M535 57 L565 140 M590 57 L565 140\" class=\"ln\"/>\r\n  <text x=\"535\" y=\"190\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">Kai user ↔ kam/barabar kernel</text>\r\n</svg><div class=\"cap\">Fig 1.15: Threading models (circle = user thread, square = kernel thread)</div></div>\r\n\r\n<table>\r\n<tr><th>Process</th><th>Thread</th></tr>\r\n<tr><td>Heavyweight</td><td>Lightweight</td></tr>\r\n<tr><td>Alag address space</td><td>Address space share karte hain</td></tr>\r\n<tr><td>Context switch costly</td><td>Context switch sasta</td></tr>\r\n<tr><td>Communication ke liye IPC chahiye</td><td>Direct shared memory se communication</td></tr>\r\n<tr><td>Ek process crash, baaki safe</td><td>Ek thread crash to poora process</td></tr>\r\n</table>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u1-cpusched",
        "title": "1.8 CPU Scheduling",
        "html": "<h3>1.8 CPU Scheduling</h3>\r\n<p>Multiprogramming mein ready queue mein kai processes hote hain. <b>CPU scheduler</b> decide karta hai ki CPU kise mile.</p>\r\n\r\n<h4>Preemptive vs Non-preemptive</h4>\r\n<table>\r\n<tr><th>Non-Preemptive</th><th>Preemptive</th></tr>\r\n<tr><td>Process CPU tab tak rakhta hai jab tak khatam ya wait na kare</td><td>OS beech mein CPU chheen sakta hai (time-out ya high priority process aaye)</td></tr>\r\n<tr><td>Simple, kam overhead</td><td>Zyada context switches, par fair aur responsive</td></tr>\r\n<tr><td>FCFS, SJF (NP), Priority (NP)</td><td>SRTF, RR, Priority (P)</td></tr>\r\n</table>\r\n\r\n<h4>Scheduling Criteria</h4>\r\n<ul>\r\n<li><b>CPU Utilization:</b> CPU kitna busy (maximize)</li>\r\n<li><b>Throughput:</b> per unit time kitne process complete (maximize)</li>\r\n<li><b>Turnaround Time (TAT):</b> submit se complete tak ka total time (minimize)</li>\r\n<li><b>Waiting Time (WT):</b> ready queue mein kitna wait kiya (minimize)</li>\r\n<li><b>Response Time (RT):</b> request se <b>pehle response</b> tak (minimize)</li>\r\n</ul>\r\n<div class=\"imp\"><b class=\"t\">Formulas (yaad kar lo)</b>\r\nTurnaround Time = Completion Time (CT) − Arrival Time (AT)<br>\r\nWaiting Time = Turnaround Time − Burst Time (BT)<br>\r\nResponse Time = First CPU time − Arrival Time<br>\r\n<b>Gantt chart</b> = schedule ko timeline par dikhane wala bar chart.</div>\r\n\r\n<h4>Scheduling Algorithms</h4>\r\n<h5>1. FCFS (First Come First Serve)</h5>\r\n<p>Jo pehle aaya wo pehle. Non-preemptive, FIFO queue. <b>Problem: Convoy effect</b> (lamba process chhote processes ko roke rakhta hai), average WT zyada.</p>\r\n<h5>2. SJF (Shortest Job First)</h5>\r\n<p>Sabse chhota burst time wala pehle. <b>Optimal</b> (minimum average WT) hai. Problem: burst time pehle se pata nahi hota (predict karte hain), aur lambe processes ko <b>starvation</b>. Preemptive version: <b>SRTF (Shortest Remaining Time First)</b>.</p>\r\n<h5>3. Priority Scheduling</h5>\r\n<p>Har process ko priority; high priority pehle. Preemptive/non-preemptive. <b>Problem: starvation</b>. <b>Solution: Aging</b> (wait karne par priority dheere-dheere badhao).</p>\r\n<h5>4. Round Robin (RR)</h5>\r\n<p>Time-sharing ke liye bana. Har process ko <b>time quantum (q)</b> milta hai, phir wo ready queue ke end mein chala jata hai. Preemptive. q bahut bada to FCFS ban jata hai, q bahut chhota to context switch overhead badh jata hai.</p>\r\n<h5>5. Multilevel Queue</h5>\r\n<p>Ready queue ko alag-alag queues mein baanta (foreground/interactive, background/batch). Har queue ka apna algorithm. Queues ke beech fixed priority ya time slice. Process ek queue se doosri mein nahi jata.</p>\r\n<h5>6. Multilevel Feedback Queue (MLFQ)</h5>\r\n<p>Process queues ke beech <b>move</b> kar sakta hai. CPU zyada use kare to neeche ki queue mein, zyada wait kare to upar (aging). Sabse flexible aur complex.</p>\r\n\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 640 190\" width=\"640\">\r\n  <rect x=\"20\" y=\"20\" width=\"270\" height=\"36\" class=\"c1\"/><text x=\"155\" y=\"43\" text-anchor=\"middle\">Q0: RR quantum = 8 (highest)</text>\r\n  <rect x=\"20\" y=\"64\" width=\"270\" height=\"36\" class=\"c3\"/><text x=\"155\" y=\"87\" text-anchor=\"middle\">Q1: RR quantum = 16</text>\r\n  <rect x=\"20\" y=\"108\" width=\"270\" height=\"36\" class=\"c4\"/><text x=\"155\" y=\"131\" text-anchor=\"middle\">Q2: FCFS (lowest)</text>\r\n  <path d=\"M290 38 H340\" class=\"ar\"/><path d=\"M290 82 H340\" class=\"ar\"/><path d=\"M290 126 H340\" class=\"ar\"/>\r\n  <rect x=\"345\" y=\"38\" width=\"80\" height=\"90\" rx=\"10\" class=\"c2\"/><text x=\"385\" y=\"88\" text-anchor=\"middle\" class=\"b\">CPU</text>\r\n  <text x=\"440\" y=\"60\" class=\"lt\" font-size=\"12\">Q0 ka quantum khatam →</text><text x=\"440\" y=\"76\" class=\"lt\" font-size=\"12\">process Q1 mein</text>\r\n  <text x=\"440\" y=\"108\" class=\"lt\" font-size=\"12\">Q1 mein bhi → Q2 mein</text>\r\n</svg><div class=\"cap\">Fig 1.16: Multilevel Feedback Queue</div></div>\r\n\r\n<h4>Worked Example (Tumhare exam ke liye)</h4>\r\n<div class=\"ex\"><b class=\"t\">Question</b> Processes: P1 (AT 0, BT 6), P2 (AT 1, BT 8), P3 (AT 2, BT 7), P4 (AT 3, BT 3). FCFS, SJF (non-preemptive) aur RR (q=4) se average WT aur TAT nikalo.</div>\r\n<table>\r\n<tr><th>Algorithm</th><th>Gantt Chart (order)</th><th>Completion Times</th><th>Avg TAT</th><th>Avg WT</th></tr>\r\n<tr><td><b>FCFS</b></td><td>P1(0-6) P2(6-14) P3(14-21) P4(21-24)</td><td>P1=6, P2=14, P3=21, P4=24</td><td>14.75</td><td>8.75</td></tr>\r\n<tr><td><b>SJF (NP)</b></td><td>P1(0-6) P4(6-9) P3(9-16) P2(16-24)</td><td>P1=6, P4=9, P3=16, P2=24</td><td>12.25</td><td>6.25</td></tr>\r\n<tr><td><b>RR (q=4)</b></td><td>P1(0-4) P2(4-8) P3(8-12) P4(12-15) P1(15-17) P2(17-21) P3(21-24)</td><td>P1=17, P2=21, P3=24, P4=15</td><td>17.75</td><td>11.75</td></tr>\r\n</table>\r\n<p>Dekho: SJF ka average WT sabse kam aaya (optimal). Neeche simulator mein khud values badal kar try karo.</p>\r\n\r\n\r\n\r\n<h4>Multiple-Processor Scheduling</h4>\r\n<ul>\r\n<li><b>Asymmetric:</b> ek master processor scheduling aur I/O decisions leta hai. Simple.</li>\r\n<li><b>Symmetric (SMP):</b> har processor khud schedule karta hai (common ready queue ya per-CPU queue).</li>\r\n<li><b>Processor Affinity:</b> process ko usi CPU par chalao taaki cache data reuse ho. (soft affinity / hard affinity)</li>\r\n<li><b>Load Balancing:</b> sab CPUs mein kaam barabar baantna. <b>Push migration</b> (busy CPU se doosre ko bhejo) aur <b>pull migration</b> (idle CPU kaam kheench le).</li>\r\n<li><b>Multicore / hyper-threading</b> par bhi isi tarah ke issues.</li>\r\n</ul>\r\n\r\n<h4>Algorithm Evaluation (Konsa algorithm best?)</h4>\r\n<ol>\r\n<li><b>Deterministic Modeling:</b> ek fixed workload lekar har algorithm ka performance calculate (jaise upar ka example). Simple, par sirf us workload ke liye.</li>\r\n<li><b>Queueing Models:</b> arrival aur service rate ki probability distribution se maths. <b>Little's Formula: n = λ × W</b> (n = avg queue length, λ = arrival rate, W = avg wait time).</li>\r\n<li><b>Simulation:</b> computer system ka software model banao, random/trace data se chalao. Accurate par costly.</li>\r\n<li><b>Implementation:</b> asli OS mein code karke test. Sabse accurate, par sabse costly.</li>\r\n</ol>",
        "qas": [],
        "hasCpuSim": true,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u1-qa",
        "title": "Unit 1: Predicted Questions",
        "html": "<h3>Unit 1: Predicted Exam Questions (with Answers)</h3>",
        "qas": [
          {
            "marks": "2M",
            "q": "Operating System ko define karo.",
            "a": "OS ek system software hai jo hardware aur user ke beech interface banata hai aur CPU, memory, I/O, files jaise resources ko manage karta hai. (Examples: Windows, Linux, Android.)"
          },
          {
            "marks": "2M",
            "q": "Multiprogramming aur Multitasking (Time-sharing) mein difference batao.",
            "a": "Multiprogramming: memory mein kai jobs, CPU switch tab hota hai jab job I/O mein jaye, goal CPU utilization. Time-sharing: CPU time chhote quantum mein baanta jata hai, timer interrupt se switch, goal fast response time aur interactivity."
          },
          {
            "marks": "4M",
            "q": "Hard real-time aur soft real-time system mein antar likho. Example do.",
            "a": "Hard RT: deadline miss = failure (pacemaker, airbag, missile). Soft RT: deadline miss se sirf quality girti hai (video streaming, gaming). Hard RT mein guarantee zaruri, soft mein best effort."
          },
          {
            "marks": "4M",
            "q": "Parallel aur Distributed system mein kya difference hai?",
            "a": "Parallel: shared memory, ek clock, tightly coupled, bus se. Distributed: har node ki apni memory aur clock, loosely coupled, network se, message passing. Table se likho (Section 1.1)."
          },
          {
            "marks": "10M",
            "q": "Different OS structures (Monolithic, Layered, Microkernel) explain karo diagram ke saath.",
            "a": "Section 1.2 ka table aur Fig 1.6 banao. Monolithic: sab kernel mein, fast par unsafe. Layered: layer N sirf N-1 use karti hai, debugging aasaan. Microkernel: sirf IPC+memory+scheduling kernel mein, baaki user space servers, secure par message overhead. Examples: UNIX, THE, Mach/QNX."
          },
          {
            "marks": "4M",
            "q": "OS ki major services likho.",
            "a": "User interface, program execution, I/O operations, file system manipulation, communication, error detection, resource allocation, accounting, protection &amp; security. (Har ek ke saath 1 line.)"
          },
          {
            "marks": "10M",
            "q": "System call kya hai? Types explain karo. Parameter passing ke methods?",
            "a": "Definition + Fig 1.7 (user mode → trap → kernel mode). 6 types: process control, file mgmt, device mgmt, information maintenance, communication, protection (examples ke saath). Parameter passing: registers, memory table (address in register), stack."
          },
          {
            "marks": "10M",
            "q": "Booting process step by step explain karo.",
            "a": "Power ON → POST → BIOS/UEFI → Boot loader (MBR se GRUB) → Kernel load → Kernel initialization → System services → Login. Fig 1.8 banao. Firmware ROM mein hota hai (bootstrap program)."
          },
          {
            "marks": "10M",
            "q": "Process state diagram draw karke explain karo. PCB kya hota hai?",
            "a": "Fig 1.10 (New, Ready, Running, Waiting, Terminated, transitions: admitted, dispatch, interrupt, I/O wait, I/O complete, exit). PCB: PID, state, PC, registers, scheduling info, memory info, accounting, I/O status (Fig 1.11)."
          },
          {
            "marks": "4M",
            "q": "Long-term, short-term aur medium-term scheduler mein difference.",
            "a": "Long-term: job pool se memory mein laata (degree of multiprogramming control). Short-term: ready queue se CPU deta (fast). Medium-term: swapping (process ko memory se bahar/andar)."
          },
          {
            "marks": "4M",
            "q": "Context switch kya hai? Ye overhead kyun hai?",
            "a": "CPU ko ek process se doosre ko dena: purane ka state PCB mein save, naye ka load. Is dauran koi useful kaam nahi hota, isliye overhead. Speed hardware support (registers sets) par depend."
          },
          {
            "marks": "10M",
            "q": "IPC explain karo. Shared memory aur message passing compare karo.",
            "a": "Cooperating processes ke beech data exchange. Fig 1.13. Shared memory fast par sync khud; message passing kernel-managed, slow par safe, distributed ke liye. Direct/indirect communication, blocking/non-blocking, buffering."
          },
          {
            "marks": "10M",
            "q": "Thread kya hai? Multithreading models explain karo. Thread aur process mein antar.",
            "a": "Section 1.7: definition, Fig 1.14, benefits, ULT vs KLT, many-to-one, one-to-one, many-to-many (Fig 1.15), process vs thread table."
          },
          {
            "marks": "10M",
            "q": "Numerical: FCFS, SJF, RR se avg WT/TAT nikalo, Gantt chart banao.",
            "a": "Pehle Gantt chart, phir CT, TAT = CT − AT, WT = TAT − BT. Is notes ka example (Section 1.8) dekho. Har step likho, marks wahi milte hain. Final answer mein average zarur likho."
          },
          {
            "marks": "4M",
            "q": "Starvation kya hai aur aging se kaise solve hota hai?",
            "a": "Low priority process ko CPU kabhi na milna (priority / SJF mein). Aging: wait time ke saath priority dheere badhana, taaki aakhir mein process run ho jaye."
          },
          {
            "marks": "10M",
            "q": "Multilevel queue aur multilevel feedback queue scheduling explain karo.",
            "a": "MLQ: fixed queues, process queue badalta nahi. MLFQ: process queues ke beech move karta hai (zyada CPU use = neeche, zyada wait = upar). Fig 1.16 aur parameters (queues ki sankhya, har queue ka algorithm, upgrade/demote rule)."
          },
          {
            "marks": "4M",
            "q": "Algorithm evaluation ke methods batao.",
            "a": "Deterministic modeling, queueing models (Little's formula n = λW), simulation, implementation."
          },
          {
            "marks": "2M",
            "q": "Dispatcher aur dispatch latency kya hai?",
            "a": "Dispatcher short-term scheduler ke chune process ko CPU control deta hai (context switch, user mode, jump to PC). Is kaam mein lagne wala time dispatch latency."
          }
        ],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": true
      }
    ],
    "quiz": [
      {
        "q": "Kaun sa CPU scheduling algorithm minimum average waiting time deta hai?",
        "o": [
          "FCFS",
          "SJF",
          "Round Robin",
          "Priority"
        ],
        "a": 1
      },
      {
        "q": "Ready state ka process Running state mein kis event se jata hai?",
        "o": [
          "Admitted",
          "Dispatch",
          "I/O completion",
          "Exit"
        ],
        "a": 1
      },
      {
        "q": "Time-sharing system ka main goal kya hai?",
        "o": [
          "Throughput maximize",
          "Response time minimize",
          "Cost kam",
          "Batch jobs"
        ],
        "a": 1
      },
      {
        "q": "Kernel mein sirf minimum functions rakhne wala structure?",
        "o": [
          "Monolithic",
          "Layered",
          "Microkernel",
          "Simple"
        ],
        "a": 2
      },
      {
        "q": "Ek process ke threads kya share KARTE hain?",
        "o": [
          "Stack",
          "Registers",
          "Code aur data section",
          "Program counter"
        ],
        "a": 2
      },
      {
        "q": "fork() child process ko kya return karta hai?",
        "o": [
          "Child ka PID",
          "0",
          "-1",
          "Parent ka PID"
        ],
        "a": 1
      },
      {
        "q": "Little's formula kaun sa hai?",
        "o": [
          "n = λ × W",
          "n = λ + W",
          "n = W / λ",
          "n = λ − W"
        ],
        "a": 0
      },
      {
        "q": "Turnaround time = ?",
        "o": [
          "BT − AT",
          "CT − AT",
          "CT − BT",
          "AT + BT"
        ],
        "a": 1
      }
    ]
  },
  {
    "id": "u2",
    "number": 2,
    "title": "Unit 2: Process Synchronization, Deadlocks & Memory Management",
    "desc": "Critical section problem, semaphores, classical sync problems, monitors, Banker's algorithm, paging, segmentation, and virtual memory page replacement.",
    "topics": [
      {
        "id": "u2-cs",
        "title": "2.1 Critical Section Problem",
        "html": "<h3>2.1 The Critical-Section Problem</h3>\r\n<div class=\"def\"><b class=\"t\">Race Condition</b> Jab do ya zyada processes <b>shared data</b> ko ek saath access/modify karte hain aur final result <b>execution ke order par depend</b> karta hai, to usse race condition kehte hain.</div>\r\n<div class=\"ex\"><b class=\"t\">Example</b> Shared variable <code>count = 5</code>. Producer <code>count++</code> aur Consumer <code>count--</code> chalate hain. Machine level par: <code>reg = count; reg = reg ± 1; count = reg</code>. Agar dono interleave ho jayein to count 4 ya 6 aa sakta hai (sahi 5 hona chahiye).</div>\r\n\r\n<div class=\"def\"><b class=\"t\">Critical Section (CS)</b> Process ka wo code segment jahan wo shared resources access karta hai. Ek time par sirf <b>ek process</b> CS mein hona chahiye.</div>\r\n<pre><code>do {\r\n    entry section      // permission maango\r\n        CRITICAL SECTION\r\n    exit section       // permission chhodo\r\n    remainder section\r\n} while (true);</code></pre>\r\n\r\n<h4>Solution ki 3 Requirements (Zaroor yaad rakho)</h4>\r\n<ol>\r\n<li><b>Mutual Exclusion:</b> ek time par sirf ek process CS mein.</li>\r\n<li><b>Progress:</b> agar CS khali hai aur kuch processes jaana chahte hain, to selection ko bina wajah delay nahi kar sakte. Sirf jo remainder section mein nahi hain wahi decide mein shaamil.</li>\r\n<li><b>Bounded Waiting:</b> process ke request karne ke baad, doosre processes kitni baar CS mein ja sakte hain ki limit honi chahiye (starvation nahi).</li>\r\n</ol>\r\n\r\n<h4>Peterson's Solution (2 processes, software)</h4>\r\n<pre><code>int turn;  boolean flag[2];\r\n\r\n// Process Pi (j = doosra process)\r\ndo {\r\n    flag[i] = true;       // main CS chahta hoon\r\n    turn = j;             // pehle doosre ko mauka\r\n    while (flag[j] && turn == j);   // wait\r\n        /* critical section */\r\n    flag[i] = false;      // exit\r\n        /* remainder section */\r\n} while (true);</code></pre>\r\n<p>Teeno requirements satisfy karta hai. Limitation: sirf 2 processes, modern hardware par instruction reordering se fail ho sakta hai.</p>\r\n\r\n<h4>Synchronization Hardware</h4>\r\n<p>Atomic (beech mein na tootne wali) instructions:</p>\r\n<pre><code>// Test-and-Set\r\nboolean TestAndSet(boolean *target){\r\n    boolean rv = *target;\r\n    *target = true;\r\n    return rv;\r\n}\r\ndo {\r\n    while (TestAndSet(&amp;lock));   // spin\r\n        /* critical section */\r\n    lock = false;\r\n} while (true);\r\n\r\n// Swap(a, b): a aur b ki values atomically exchange</code></pre>\r\n<p>Single processor par <b>interrupts disable</b> karke bhi CS protect ho sakta hai (par multiprocessor mein costly). Test-and-Set se <b>mutual exclusion</b> milta hai par <b>bounded waiting</b> nahi (alag algorithm chahiye).</p>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u2-sem",
        "title": "2.2 Semaphores aur Classical Problems",
        "html": "<h3>2.2 Semaphores</h3>\r\n<div class=\"def\"><b class=\"t\">Semaphore</b> Ek integer variable <code>S</code> jo sirf do <b>atomic</b> operations se access hota hai: <code>wait(S)</code> (P) aur <code>signal(S)</code> (V).</div>\r\n<pre><code>wait(S):   while (S &lt;= 0);  S--;     // P operation\r\nsignal(S): S++;                      // V operation</code></pre>\r\n<table>\r\n<tr><th>Counting Semaphore</th><th>Binary Semaphore (Mutex)</th></tr>\r\n<tr><td>Value kisi bhi integer range mein</td><td>Value sirf 0 ya 1</td></tr>\r\n<tr><td>Multiple identical resources ke liye (jaise 3 printers)</td><td>Mutual exclusion (lock)</td></tr>\r\n</table>\r\n<p><b>Busy waiting (spinlock):</b> process loop mein CPU waste karta hai. <b>Solution:</b> blocking semaphore: wait karne par process ko semaphore ki <b>waiting queue</b> mein daalo (block), signal par <code>wakeup</code>.</p>\r\n<pre><code>// Mutual exclusion with semaphore\r\nsemaphore mutex = 1;\r\nwait(mutex);\r\n   // critical section\r\nsignal(mutex);</code></pre>\r\n<div class=\"imp\"><b class=\"t\">Dhyan se</b> Galat order (signal pehle, wait baad mein) se mutual exclusion toot jata hai, aur dono wait se <b>deadlock</b> ban sakta hai.</div>\r\n\r\n<h4>Classical Problems of Synchronization</h4>\r\n<h5>1. Bounded Buffer (Producer-Consumer)</h5>\r\n<p>N slots ka buffer. Semaphores: <code>mutex = 1</code> (buffer access), <code>empty = N</code> (khali slots), <code>full = 0</code> (bhare slots).</p>\r\n<pre><code>// Producer                    // Consumer\r\ndo {                           do {\r\n  produce item                   wait(full);\r\n  wait(empty);                   wait(mutex);\r\n  wait(mutex);                   remove item from buffer\r\n  add item to buffer             signal(mutex);\r\n  signal(mutex);                 signal(empty);\r\n  signal(full);                  consume item\r\n} while(1);                    } while(1);</code></pre>\r\n\r\n<h5>2. Readers-Writers Problem</h5>\r\n<p>Database ko kai <b>readers</b> ek saath read kar sakte hain, par <b>writer</b> ko akela (exclusive) access chahiye.</p>\r\n<pre><code>semaphore rw_mutex = 1, mutex = 1;  int read_count = 0;\r\n\r\n// Writer                       // Reader\r\nwait(rw_mutex);                 wait(mutex);\r\n  /* write */                   read_count++;\r\nsignal(rw_mutex);               if (read_count == 1) wait(rw_mutex);  // pehla reader lock\r\n                                signal(mutex);\r\n                                  /* reading */\r\n                                wait(mutex);\r\n                                read_count--;\r\n                                if (read_count == 0) signal(rw_mutex); // aakhri reader unlock\r\n                                signal(mutex);</code></pre>\r\n<p>Is solution mein writer starve ho sakta hai (first readers-writers problem).</p>\r\n\r\n<h5>3. Dining Philosophers Problem</h5>\r\n<p>5 philosophers gol table par; beech mein 5 chopsticks. Khane ke liye dono taraf ki chopstick chahiye.</p>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 360 300\" width=\"360\">\r\n  <circle cx=\"180\" cy=\"150\" r=\"62\" class=\"c7\"/><text x=\"180\" y=\"155\" text-anchor=\"middle\" class=\"b\">Table</text>\r\n  <circle cx=\"180\" cy=\"38\" r=\"26\" class=\"c3\"/><text x=\"180\" y=\"43\" text-anchor=\"middle\" font-size=\"13\">P0</text>\r\n  <circle cx=\"288\" cy=\"112\" r=\"26\" class=\"c3\"/><text x=\"288\" y=\"117\" text-anchor=\"middle\" font-size=\"13\">P1</text>\r\n  <circle cx=\"246\" cy=\"244\" r=\"26\" class=\"c3\"/><text x=\"246\" y=\"249\" text-anchor=\"middle\" font-size=\"13\">P2</text>\r\n  <circle cx=\"114\" cy=\"244\" r=\"26\" class=\"c3\"/><text x=\"114\" y=\"249\" text-anchor=\"middle\" font-size=\"13\">P3</text>\r\n  <circle cx=\"72\" cy=\"112\" r=\"26\" class=\"c3\"/><text x=\"72\" y=\"117\" text-anchor=\"middle\" font-size=\"13\">P4</text>\r\n  <text x=\"248\" y=\"62\" font-size=\"12\" class=\"lt\">C0</text><text x=\"276\" y=\"190\" font-size=\"12\" class=\"lt\">C1</text><text x=\"180\" y=\"278\" font-size=\"12\" class=\"lt\" text-anchor=\"middle\">C2</text><text x=\"76\" y=\"190\" font-size=\"12\" class=\"lt\">C3</text><text x=\"106\" y=\"62\" font-size=\"12\" class=\"lt\">C4</text>\r\n</svg><div class=\"cap\">Fig 2.1: Dining philosophers (P = philosopher, C = chopstick)</div></div>\r\n<pre><code>semaphore chopstick[5] = {1,1,1,1,1};\r\ndo {\r\n   wait(chopstick[i]);\r\n   wait(chopstick[(i+1) % 5]);\r\n      /* eat */\r\n   signal(chopstick[i]);\r\n   signal(chopstick[(i+1) % 5]);\r\n      /* think */\r\n} while (1);</code></pre>\r\n<p><b>Problem:</b> sab ek saath left chopstick utha lein to <b>deadlock</b>. <b>Solutions:</b> maximum 4 philosophers ko table par baitho; dono chopsticks available hone par hi uthao (atomic); odd philosopher pehle left, even pehle right (asymmetric); monitor use karo.</p>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u2-monitor",
        "title": "2.3 Critical Regions aur Monitors",
        "html": "<h3>2.3 Critical Regions aur Monitors</h3>\r\n<p>Semaphore ka galat use (wait/signal order bhoolna) hard-to-debug errors deta hai. Isliye <b>high-level constructs</b> aaye.</p>\r\n<div class=\"def\"><b class=\"t\">Critical Region</b> Language construct: <code>region v when (B) S;</code> Shared variable <code>v</code> par statement <code>S</code> tab chalega jab condition <code>B</code> true ho, aur wo bhi <b>mutual exclusion</b> ke saath. Compiler locks/semaphores khud laga deta hai.</div>\r\n<div class=\"def\"><b class=\"t\">Monitor</b> Ek abstract data type jisme shared data aur uske operations ek saath bandhe hote hain. <b>Ek time par monitor ke andar sirf ek process active</b> ho sakta hai (automatic mutual exclusion). Waiting ke liye <b>condition variables</b> (<code>x.wait()</code>, <code>x.signal()</code>) hote hain.</div>\r\n<pre><code>monitor ResourceAllocator {\r\n    boolean busy = false;\r\n    condition x;\r\n    void acquire() {\r\n        if (busy) x.wait();     // wait karo\r\n        busy = true;\r\n    }\r\n    void release() {\r\n        busy = false;\r\n        x.signal();             // ek waiting ko jagao\r\n    }\r\n}</code></pre>\r\n<table>\r\n<tr><th>Semaphore</th><th>Monitor</th></tr>\r\n<tr><td>Low-level, programmer ko manually wait/signal</td><td>High-level, mutual exclusion automatic</td></tr>\r\n<tr><td>Galti ka chance zyada</td><td>Safe, kam errors</td></tr>\r\n<tr><td>signal hamesha effect karta hai (count badhta)</td><td>x.signal() agar koi wait nahi kar raha to kuch nahi hota</td></tr>\r\n</table>\r\n<p>Java ka <code>synchronized</code> keyword monitor ka hi example hai.</p>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u2-deadlock",
        "title": "2.4 Deadlock",
        "html": "<h3>2.4 Deadlock</h3>\r\n<div class=\"def\"><b class=\"t\">Deadlock</b> Processes ka ek set jisme har process kisi aise resource ka wait kar raha hai jo set ke <b>kisi doosre process ke paas</b> hai. Koi bhi aage nahi badh pata, hamesha ke liye ruka rehta hai.</div>\r\n<div class=\"ex\"><b class=\"t\">Real life</b> Ek patli gali mein do gaadiyan aamne-saamne, koi peeche nahi hat sakta. Ya: P1 ke paas Printer hai aur Scanner chahiye; P2 ke paas Scanner hai aur Printer chahiye.</div>\r\n\r\n<h4>System Model</h4>\r\n<p>Process resource ko 3 steps mein use karta hai: <b>Request → Use → Release</b>. Resources ke types: CPU cycles, memory, files, devices (har type ke kai instances).</p>\r\n\r\n<h4>Deadlock ki 4 Necessary Conditions (Coffman)</h4>\r\n<p>Deadlock ke liye <b>chaaron ek saath</b> hone chahiye:</p>\r\n<table>\r\n<tr><th>#</th><th>Condition</th><th>Matlab</th></tr>\r\n<tr><td>1</td><td><b>Mutual Exclusion</b></td><td>Resource ek time par sirf ek process use kare (non-shareable)</td></tr>\r\n<tr><td>2</td><td><b>Hold and Wait</b></td><td>Process ek resource pakde hue doosre ka wait kare</td></tr>\r\n<tr><td>3</td><td><b>No Preemption</b></td><td>Resource ko zabardasti chheena nahi ja sakta, process khud chhodega</td></tr>\r\n<tr><td>4</td><td><b>Circular Wait</b></td><td>P0→P1→...→Pn→P0 ka circular chain, har ek agle ka wait kar raha</td></tr>\r\n</table>\r\n\r\n<h4>Resource Allocation Graph (RAG)</h4>\r\n<ul>\r\n<li>Process = <b>circle</b>, Resource = <b>rectangle</b> (andar dots = instances)</li>\r\n<li><b>Request edge:</b> P → R (P resource R maang raha)</li>\r\n<li><b>Assignment edge:</b> R → P (R ko P ko de diya)</li>\r\n</ul>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 640 210\" width=\"640\">\r\n  <text x=\"150\" y=\"16\" text-anchor=\"middle\" class=\"b lt\">(a) Deadlock hai (cycle)</text>\r\n  <circle cx=\"60\" cy=\"100\" r=\"26\" class=\"c3\"/><text x=\"60\" y=\"105\" text-anchor=\"middle\" class=\"b\">P1</text>\r\n  <circle cx=\"240\" cy=\"100\" r=\"26\" class=\"c3\"/><text x=\"240\" y=\"105\" text-anchor=\"middle\" class=\"b\">P2</text>\r\n  <rect x=\"120\" y=\"40\" width=\"40\" height=\"40\" class=\"c1\"/><circle cx=\"140\" cy=\"60\" r=\"5\" fill=\"#1e293b\"/><text x=\"140\" y=\"34\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">R1</text>\r\n  <rect x=\"120\" y=\"120\" width=\"40\" height=\"40\" class=\"c1\"/><circle cx=\"140\" cy=\"140\" r=\"5\" fill=\"#1e293b\"/><text x=\"140\" y=\"180\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">R2</text>\r\n  <path d=\"M120 62 L82 90\" class=\"ar\"/><text x=\"88\" y=\"64\" class=\"lt\" font-size=\"11\">assign</text>\r\n  <path d=\"M82 112 L120 138\" class=\"ar\"/><text x=\"70\" y=\"145\" class=\"lt\" font-size=\"11\">request</text>\r\n  <path d=\"M160 142 L218 112\" class=\"ar\"/><text x=\"190\" y=\"150\" class=\"lt\" font-size=\"11\">assign</text>\r\n  <path d=\"M218 88 L160 62\" class=\"ar\"/><text x=\"195\" y=\"62\" class=\"lt\" font-size=\"11\">request</text>\r\n  <text x=\"150\" y=\"203\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">P1→R2→P2→R1→P1 (cycle)</text>\r\n  <text x=\"480\" y=\"16\" text-anchor=\"middle\" class=\"b lt\">(b) Cycle nahi, deadlock nahi</text>\r\n  <circle cx=\"400\" cy=\"100\" r=\"26\" class=\"c3\"/><text x=\"400\" y=\"105\" text-anchor=\"middle\" class=\"b\">P1</text>\r\n  <circle cx=\"580\" cy=\"100\" r=\"26\" class=\"c3\"/><text x=\"580\" y=\"105\" text-anchor=\"middle\" class=\"b\">P2</text>\r\n  <rect x=\"460\" y=\"80\" width=\"40\" height=\"40\" class=\"c1\"/><circle cx=\"480\" cy=\"100\" r=\"5\" fill=\"#1e293b\"/><text x=\"480\" y=\"72\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">R1</text>\r\n  <path d=\"M460 100 L428 100\" class=\"ar\"/>\r\n  <path d=\"M552 100 L502 100\" class=\"ar\"/>\r\n  <text x=\"480\" y=\"150\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">R1 → P1 (assign), P2 → R1 (request)</text>\r\n</svg><div class=\"cap\">Fig 2.2: Resource Allocation Graph</div></div>\r\n<div class=\"imp\"><b class=\"t\">Rule</b> Cycle nahi = deadlock nahi. Cycle hai aur har resource ka <b>ek hi instance</b> = deadlock pakka. Cycle hai par resource ke <b>kai instances</b> = deadlock ho bhi sakta hai, nahi bhi.</div>\r\n\r\n<h4>Deadlock Handling ke Methods</h4>\r\n<ol><li><b>Prevention</b> (4 conditions mein se ek todo)</li><li><b>Avoidance</b> (safe state, Banker's algorithm)</li><li><b>Detection &amp; Recovery</b> (hone do, phir theek karo)</li><li><b>Ignore</b> (Ostrich algorithm): Windows/UNIX mostly yahi karte hain.</li></ol>\r\n\r\n<h4>A. Deadlock Prevention</h4>\r\n<table>\r\n<tr><th>Condition todna</th><th>Kaise</th><th>Nuksan</th></tr>\r\n<tr><td>Mutual Exclusion</td><td>Resources ko sharable banao (read-only files). Printer jaise ke liye possible nahi</td><td>Hamesha possible nahi</td></tr>\r\n<tr><td>Hold and Wait</td><td>Process shuru mein <b>saare resources ek saath</b> maange, ya resource maangne se pehle sab chhod de</td><td>Low utilization, starvation</td></tr>\r\n<tr><td>No Preemption</td><td>Agar request nahi mili to jo pakda hai wo bhi chheen lo (preempt)</td><td>CPU register/printer jaise ke liye mushkil</td></tr>\r\n<tr><td>Circular Wait</td><td>Saare resource types ko <b>number</b> do, process sirf <b>badhte order</b> mein request kare</td><td>Order fix karna mushkil</td></tr>\r\n</table>\r\n\r\n<h4>B. Deadlock Avoidance</h4>\r\n<p>OS ko pehle se <b>maximum need</b> pata honi chahiye. OS har request par check karta hai ki system <b>safe state</b> mein rahega ya nahi.</p>\r\n<ul>\r\n<li><b>Safe state:</b> ek aisi <b>safe sequence</b> &lt;P1, P2 ... Pn&gt; hai jisme har process ki need pichle processes ke chhodne ke baad poori ho sakti hai. Safe → deadlock nahi.</li>\r\n<li><b>Unsafe state:</b> safe sequence nahi. Deadlock ka <b>chance</b> (zaruri nahi ki ho).</li>\r\n</ul>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 420 150\" width=\"420\">\r\n  <ellipse cx=\"210\" cy=\"75\" rx=\"200\" ry=\"65\" class=\"c7\"/>\r\n  <ellipse cx=\"130\" cy=\"75\" rx=\"75\" ry=\"45\" class=\"c2\"/><text x=\"130\" y=\"80\" text-anchor=\"middle\" class=\"b\">Safe</text>\r\n  <ellipse cx=\"290\" cy=\"75\" rx=\"60\" ry=\"38\" class=\"c3\"/><text x=\"290\" y=\"72\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">Unsafe</text>\r\n  <ellipse cx=\"330\" cy=\"105\" rx=\"30\" ry=\"14\" class=\"c6\"/><text x=\"330\" y=\"109\" text-anchor=\"middle\" class=\"b\" font-size=\"12\">Deadlock</text>\r\n</svg><div class=\"cap\">Fig 2.3: Safe, Unsafe aur Deadlock states</div></div>\r\n\r\n<h5>Banker's Algorithm</h5>\r\n<p>Multiple instances wale resources ke liye. Data structures (n processes, m resource types):</p>\r\n<ul>\r\n<li><b>Available[m]:</b> abhi free instances</li>\r\n<li><b>Max[n][m]:</b> process ki maximum demand</li>\r\n<li><b>Allocation[n][m]:</b> abhi kitna mila hua hai</li>\r\n<li><b>Need[n][m] = Max − Allocation</b></li>\r\n</ul>\r\n<p><b>Safety Algorithm:</b> Work = Available. Aisa process Pi dhundo jiska <b>Need ≤ Work</b> aur Finish[i] = false. Mil jaye to Work = Work + Allocation[i], Finish[i] = true, repeat. Agar saare Finish = true to <b>safe</b>.</p>\r\n<p><b>Resource-Request Algorithm:</b> Request ≤ Need aur Request ≤ Available ho to maano de diya (Available −= Request, Allocation += Request, Need −= Request), phir safety check. Safe to grant, warna process wait kare aur purani state restore.</p>\r\n<div class=\"ex\"><b class=\"t\">Numerical (classic)</b> 5 processes (P0-P4), 3 resources (A,B,C). Available = (3,3,2).\r\n<table>\r\n<tr><th>Process</th><th>Allocation (A B C)</th><th>Max (A B C)</th><th>Need = Max − Alloc</th></tr>\r\n<tr><td>P0</td><td>0 1 0</td><td>7 5 3</td><td>7 4 3</td></tr>\r\n<tr><td>P1</td><td>2 0 0</td><td>3 2 2</td><td>1 2 2</td></tr>\r\n<tr><td>P2</td><td>3 0 2</td><td>9 0 2</td><td>6 0 0</td></tr>\r\n<tr><td>P3</td><td>2 1 1</td><td>2 2 2</td><td>0 1 1</td></tr>\r\n<tr><td>P4</td><td>0 0 2</td><td>4 3 3</td><td>4 3 1</td></tr>\r\n</table>\r\n<b>Solution:</b> Work = (3,3,2). P1 need (1,2,2) ≤ Work → run, Work = (5,3,2). P3 need (0,1,1) → Work = (7,4,3). P4 need (4,3,1) → Work = (7,4,5). P2 need (6,0,0) → Work = (10,4,7). P0 need (7,4,3) → Work = (10,5,7).<br>\r\n<b>Safe sequence: &lt;P1, P3, P4, P2, P0&gt;</b>. System safe state mein hai. (Ek se zyada safe sequences ho sakti hain, jaise &lt;P1, P3, P4, P0, P2&gt; bhi valid hai. Exam mein koi ek sahi sequence kaafi hai.)</div>\r\n\r\n\r\n\r\n<h4>C. Deadlock Detection</h4>\r\n<ul>\r\n<li><b>Single instance per resource:</b> <b>Wait-for graph</b> banao (RAG se resources hata do). <b>Cycle = deadlock</b>.</li>\r\n<li><b>Multiple instances:</b> Banker's jaisa detection algorithm (Available, Allocation, Request matrices).</li>\r\n<li>Detection algorithm kab chalayein: har request par (costly) ya periodically/CPU utilization girne par.</li>\r\n</ul>\r\n\r\n<h4>D. Recovery from Deadlock</h4>\r\n<ul>\r\n<li><b>Process Termination:</b> saare deadlocked processes abort karo (costly), ya ek-ek karke abort karo jab tak cycle na tute. Chunav: priority, ab tak kitna compute kiya, kitne resources use, kitne aur chahiye.</li>\r\n<li><b>Resource Preemption:</b> resource kisi process se chheen kar doosre ko do. Issues: <b>victim selection</b>, <b>rollback</b> (safe state tak), <b>starvation</b> (same victim baar baar na ho).</li>\r\n</ul>\r\n<h4>E. Combined Approach to Deadlock Handling</h4>\r\n<p>Koi ek approach har situation ke liye best nahi. Isliye <b>resources ko classes mein baanto</b> (internal resources, main memory, job resources, swappable space) aur har class ke liye <b>alag strategy</b> use karo. Jaise: internal resources par <b>resource ordering (prevention)</b>, main memory par <b>preemption</b>, job resources par <b>avoidance</b>, swap space par <b>pre-allocation</b>.</p>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": true,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u2-mem",
        "title": "2.5 Memory Management Basics",
        "html": "<h3>2.5 Memory Management: Address Space, Swapping, Contiguous Allocation</h3>\r\n<h4>Logical vs Physical Address</h4>\r\n<ul>\r\n<li><b>Logical (Virtual) Address:</b> CPU jo address generate karta hai. Logical address space = process ke saare logical addresses.</li>\r\n<li><b>Physical Address:</b> memory unit ko dikhne wala asli address. Physical address space.</li>\r\n<li><b>MMU (Memory Management Unit):</b> hardware jo run time par logical → physical map karta hai.</li>\r\n</ul>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 620 130\" width=\"620\">\r\n  <rect x=\"10\" y=\"40\" width=\"80\" height=\"44\" rx=\"8\" class=\"c1\"/><text x=\"50\" y=\"67\" text-anchor=\"middle\" class=\"b\">CPU</text>\r\n  <path d=\"M90 62 H150\" class=\"ar\"/><text x=\"120\" y=\"40\" text-anchor=\"middle\" class=\"lt\" font-size=\"11\">Logical 346</text>\r\n  <rect x=\"155\" y=\"25\" width=\"190\" height=\"74\" rx=\"8\" class=\"c5\"/><text x=\"250\" y=\"48\" text-anchor=\"middle\" class=\"b\">MMU</text>\r\n  <text x=\"250\" y=\"68\" text-anchor=\"middle\" font-size=\"12\">Relocation Register = 14000</text><text x=\"250\" y=\"86\" text-anchor=\"middle\" font-size=\"12\">346 + 14000</text>\r\n  <path d=\"M345 62 H405\" class=\"ar\"/><text x=\"375\" y=\"40\" text-anchor=\"middle\" class=\"lt\" font-size=\"11\">Physical 14346</text>\r\n  <rect x=\"410\" y=\"40\" width=\"110\" height=\"44\" rx=\"8\" class=\"c2\"/><text x=\"465\" y=\"67\" text-anchor=\"middle\" class=\"b\">Memory</text>\r\n</svg><div class=\"cap\">Fig 2.4: MMU: logical se physical address (relocation register)</div></div>\r\n\r\n<h4>Swapping</h4>\r\n<p>Process ko temporarily <b>main memory se backing store (disk) par bhej dena (swap out)</b> aur baad mein wapas laana (swap in). Isse total processes physical memory se zyada chal sakte hain. Context switch time zyada hota hai (transfer time).</p>\r\n\r\n<h4>Contiguous Memory Allocation</h4>\r\n<p>Har process ko memory ka <b>ek continuous block</b> milta hai.</p>\r\n<ul>\r\n<li><b>Fixed (static) partitions:</b> memory pehle se fixed size ke partitions mein. Degree of multiprogramming limited. <b>Internal fragmentation.</b></li>\r\n<li><b>Variable (dynamic) partitions:</b> process ke size ke hisaab se partition. <b>External fragmentation.</b></li>\r\n</ul>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 560 190\" width=\"560\">\r\n  <rect x=\"20\" y=\"10\" width=\"90\" height=\"170\" fill=\"none\" class=\"ln\"/>\r\n  <rect x=\"20\" y=\"10\" width=\"90\" height=\"30\" class=\"c7\"/><text x=\"65\" y=\"30\" text-anchor=\"middle\" font-size=\"12\">OS</text>\r\n  <rect x=\"20\" y=\"40\" width=\"90\" height=\"30\" class=\"c1\"/><text x=\"65\" y=\"60\" text-anchor=\"middle\" font-size=\"12\">P1 (10K)</text>\r\n  <rect x=\"20\" y=\"70\" width=\"90\" height=\"25\" fill=\"none\" class=\"ln\" stroke-dasharray=\"3,3\"/><text x=\"65\" y=\"87\" text-anchor=\"middle\" class=\"lt\" font-size=\"11\">Hole 5K</text>\r\n  <rect x=\"20\" y=\"95\" width=\"90\" height=\"30\" class=\"c2\"/><text x=\"65\" y=\"115\" text-anchor=\"middle\" font-size=\"12\">P2 (12K)</text>\r\n  <rect x=\"20\" y=\"125\" width=\"90\" height=\"25\" fill=\"none\" class=\"ln\" stroke-dasharray=\"3,3\"/><text x=\"65\" y=\"142\" text-anchor=\"middle\" class=\"lt\" font-size=\"11\">Hole 6K</text>\r\n  <rect x=\"20\" y=\"150\" width=\"90\" height=\"30\" class=\"c3\"/><text x=\"65\" y=\"170\" text-anchor=\"middle\" font-size=\"12\">P3 (8K)</text>\r\n  <text x=\"140\" y=\"90\" class=\"lt\" font-size=\"13\">External fragmentation: total free = 5K + 6K = 11K,</text>\r\n  <text x=\"140\" y=\"110\" class=\"lt\" font-size=\"13\">par 10K ka process aa nahi sakta (holes alag-alag hain).</text>\r\n  <text x=\"140\" y=\"140\" class=\"lt\" font-size=\"13\">Solution: Compaction (holes ko ek jagah jama karna)</text>\r\n  <text x=\"140\" y=\"160\" class=\"lt\" font-size=\"13\">ya Paging / Segmentation.</text>\r\n</svg><div class=\"cap\">Fig 2.5: External fragmentation</div></div>\r\n\r\n<h4>Dynamic Storage Allocation (Hole kaun sa chunein?)</h4>\r\n<table>\r\n<tr><th>Strategy</th><th>Kaam</th><th>Note</th></tr>\r\n<tr><td><b>First Fit</b></td><td>Pehla hole jo kaafi bada ho</td><td>Fast</td></tr>\r\n<tr><td><b>Best Fit</b></td><td>Sabse chhota hole jo kaafi ho</td><td>Chhote leftover holes zyada</td></tr>\r\n<tr><td><b>Worst Fit</b></td><td>Sabse bada hole</td><td>Leftover bada (use ho sakta), par aam taur par worst</td></tr>\r\n</table>\r\n<p>First fit aur best fit speed aur utilization mein worst fit se behtar hain.</p>\r\n<div class=\"imp\"><b class=\"t\">Internal vs External Fragmentation</b>\r\n<b>Internal:</b> allocated partition ke <b>andar</b> waste (process chhota, partition bada). <b>External:</b> total free space kaafi hai par <b>continuous nahi</b>. Compaction external ko theek karta hai.</div>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u2-paging",
        "title": "2.6 Paging aur Segmentation",
        "html": "<h3>2.6 Paging, Segmentation aur Segmentation with Paging</h3>\r\n<h4>Paging</h4>\r\n<div class=\"def\"><b class=\"t\">Paging</b> Logical memory ko fixed-size <b>pages</b> mein aur physical memory ko same size ke <b>frames</b> mein baanta jata hai. Process ke pages kisi bhi free frames mein (non-contiguous) rakhe ja sakte hain. <b>External fragmentation nahi</b> hoti (internal chhoti, last page mein ho sakti hai).</div>\r\n<p>Logical address = <b>Page number (p)</b> + <b>Page offset (d)</b>. <b>Page table</b> p ko frame number f se map karta hai. Physical address = f × page size + d.</p>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 640 290\" width=\"640\">\r\n  <rect x=\"10\" y=\"40\" width=\"70\" height=\"40\" class=\"c1\"/><text x=\"45\" y=\"64\" text-anchor=\"middle\" class=\"b\">p | d</text>\r\n  <text x=\"45\" y=\"30\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">Logical Addr</text>\r\n  <path d=\"M80 60 H120\" class=\"ar\"/>\r\n  <text x=\"170\" y=\"22\" text-anchor=\"middle\" class=\"b lt\" font-size=\"13\">Page Table</text>\r\n  <rect x=\"120\" y=\"30\" width=\"100\" height=\"30\" class=\"c3\"/><text x=\"170\" y=\"50\" text-anchor=\"middle\" font-size=\"13\">0 → 1</text>\r\n  <rect x=\"120\" y=\"60\" width=\"100\" height=\"30\" class=\"c3\"/><text x=\"170\" y=\"80\" text-anchor=\"middle\" font-size=\"13\">1 → 4</text>\r\n  <rect x=\"120\" y=\"90\" width=\"100\" height=\"30\" class=\"c3\"/><text x=\"170\" y=\"110\" text-anchor=\"middle\" font-size=\"13\">2 → 3</text>\r\n  <rect x=\"120\" y=\"120\" width=\"100\" height=\"30\" class=\"c3\"/><text x=\"170\" y=\"140\" text-anchor=\"middle\" font-size=\"13\">3 → 7</text>\r\n  <text x=\"170\" y=\"170\" text-anchor=\"middle\" class=\"lt\" font-size=\"11\">(page → frame)</text>\r\n  <text x=\"360\" y=\"22\" text-anchor=\"middle\" class=\"b lt\" font-size=\"13\">Physical Memory (Frames)</text>\r\n  <rect x=\"300\" y=\"30\" width=\"120\" height=\"28\" class=\"c7\"/><text x=\"360\" y=\"49\" text-anchor=\"middle\" font-size=\"12\">Frame 0</text>\r\n  <rect x=\"300\" y=\"58\" width=\"120\" height=\"28\" class=\"c1\"/><text x=\"360\" y=\"77\" text-anchor=\"middle\" font-size=\"12\">Frame 1: Page 0</text>\r\n  <rect x=\"300\" y=\"86\" width=\"120\" height=\"28\" class=\"c7\"/><text x=\"360\" y=\"105\" text-anchor=\"middle\" font-size=\"12\">Frame 2</text>\r\n  <rect x=\"300\" y=\"114\" width=\"120\" height=\"28\" class=\"c4\"/><text x=\"360\" y=\"133\" text-anchor=\"middle\" font-size=\"12\">Frame 3: Page 2</text>\r\n  <rect x=\"300\" y=\"142\" width=\"120\" height=\"28\" class=\"c2\"/><text x=\"360\" y=\"161\" text-anchor=\"middle\" font-size=\"12\">Frame 4: Page 1</text>\r\n  <rect x=\"300\" y=\"170\" width=\"120\" height=\"28\" class=\"c7\"/><text x=\"360\" y=\"189\" text-anchor=\"middle\" font-size=\"12\">Frame 5</text>\r\n  <rect x=\"300\" y=\"198\" width=\"120\" height=\"28\" class=\"c7\"/><text x=\"360\" y=\"217\" text-anchor=\"middle\" font-size=\"12\">Frame 6</text>\r\n  <rect x=\"300\" y=\"226\" width=\"120\" height=\"28\" class=\"c5\"/><text x=\"360\" y=\"245\" text-anchor=\"middle\" font-size=\"12\">Frame 7: Page 3</text>\r\n  <path d=\"M220 45 L298 72 M220 75 L298 156 M220 105 L298 128 M220 135 L298 240\" class=\"ln\" stroke-dasharray=\"4,3\"/>\r\n  <text x=\"520\" y=\"70\" class=\"lt\" font-size=\"13\">Page size = 4 KB</text>\r\n  <text x=\"520\" y=\"95\" class=\"lt\" font-size=\"13\">Logical addr = 20 bit</text>\r\n  <text x=\"520\" y=\"120\" class=\"lt\" font-size=\"13\">p = 8 bit, d = 12 bit</text>\r\n</svg><div class=\"cap\">Fig 2.6: Paging hardware</div></div>\r\n\r\n<div class=\"ex\"><b class=\"t\">Numerical</b> Page size = 1 KB, page table: page 2 → frame 6. Logical address 2500 ka physical address kya hoga?<br>\r\np = 2500 / 1024 = 2 (quotient), d = 2500 mod 1024 = 452. Frame = 6. <b>Physical = 6 × 1024 + 452 = 6596.</b><br>\r\nAgar logical address space = 2<sup>m</sup>, page size = 2<sup>n</sup> to page number bits = m − n, offset bits = n.</div>\r\n\r\n<h4>TLB (Translation Look-aside Buffer)</h4>\r\n<p>Page table memory mein hone se har access par <b>2 memory references</b> lagte (pehle page table, phir data). <b>TLB</b> chhota, bahut fast hardware cache hai jisme recently used (page, frame) entries hoti hain.</p>\r\n<ul>\r\n<li><b>TLB hit:</b> frame TLB mein mil gaya (fast).</li>\r\n<li><b>TLB miss:</b> page table se lo, TLB mein daalo.</li>\r\n</ul>\r\n<div class=\"imp\"><b class=\"t\">Effective Access Time (EAT)</b>\r\nEAT = h × (t<sub>TLB</sub> + t<sub>mem</sub>) + (1 − h) × (t<sub>TLB</sub> + 2 × t<sub>mem</sub>)<br>\r\nExample: h = 80%, TLB = 20 ns, mem = 100 ns → EAT = 0.8×120 + 0.2×220 = 96 + 44 = <b>140 ns</b>.</div>\r\n\r\n<h4>Segmentation</h4>\r\n<div class=\"def\"><b class=\"t\">Segmentation</b> Memory ko program ke <b>logical units (segments)</b> mein baanta jata hai: main program, functions, stack, heap, data. Segments <b>alag-alag size</b> ke hote hain. Address = <b>(segment number s, offset d)</b>. <b>Segment table</b> mein har segment ka <b>base</b> aur <b>limit</b> hota hai. Agar d &lt; limit to physical = base + d, warna trap (addressing error).</div>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 600 230\" width=\"600\">\r\n  <rect x=\"10\" y=\"30\" width=\"80\" height=\"40\" class=\"c1\"/><text x=\"50\" y=\"55\" text-anchor=\"middle\" class=\"b\">s | d</text>\r\n  <path d=\"M90 50 H130\" class=\"ar\"/>\r\n  <text x=\"200\" y=\"20\" text-anchor=\"middle\" class=\"b lt\" font-size=\"13\">Segment Table</text>\r\n  <rect x=\"130\" y=\"28\" width=\"140\" height=\"26\" class=\"c3\"/><text x=\"200\" y=\"46\" text-anchor=\"middle\" font-size=\"12\">Seg | Limit | Base</text>\r\n  <rect x=\"130\" y=\"54\" width=\"140\" height=\"26\" class=\"c3\"/><text x=\"200\" y=\"72\" text-anchor=\"middle\" font-size=\"12\">0 | 1000 | 1400</text>\r\n  <rect x=\"130\" y=\"80\" width=\"140\" height=\"26\" class=\"c3\"/><text x=\"200\" y=\"98\" text-anchor=\"middle\" font-size=\"12\">1 | 400 | 6300</text>\r\n  <rect x=\"130\" y=\"106\" width=\"140\" height=\"26\" class=\"c3\"/><text x=\"200\" y=\"124\" text-anchor=\"middle\" font-size=\"12\">2 | 400 | 4300</text>\r\n  <path d=\"M270 80 L330 80\" class=\"ar\"/>\r\n  <text x=\"390\" y=\"20\" text-anchor=\"middle\" class=\"b lt\" font-size=\"13\">Physical Memory</text>\r\n  <rect x=\"330\" y=\"28\" width=\"120\" height=\"30\" class=\"c7\"/><text x=\"390\" y=\"48\" text-anchor=\"middle\" font-size=\"12\">1400: Seg 0 (1000)</text>\r\n  <rect x=\"330\" y=\"58\" width=\"120\" height=\"40\" class=\"c2\"/><text x=\"390\" y=\"82\" text-anchor=\"middle\" font-size=\"12\">4300: Seg 2</text>\r\n  <rect x=\"330\" y=\"98\" width=\"120\" height=\"40\" class=\"c4\"/><text x=\"390\" y=\"122\" text-anchor=\"middle\" font-size=\"12\">6300: Seg 1</text>\r\n  <text x=\"300\" y=\"175\" text-anchor=\"middle\" class=\"lt\" font-size=\"13\">Address (s=2, d=53): 53 &lt; 400 ✓ → 4300 + 53 = 4353</text>\r\n  <text x=\"300\" y=\"198\" text-anchor=\"middle\" class=\"lt\" font-size=\"13\">Address (s=1, d=852): 852 &gt; 400 ✗ → Trap (error)</text>\r\n</svg><div class=\"cap\">Fig 2.7: Segmentation hardware</div></div>\r\n<table>\r\n<tr><th>Paging</th><th>Segmentation</th></tr>\r\n<tr><td>Fixed size pages (OS decide)</td><td>Variable size segments (programmer/compiler)</td></tr>\r\n<tr><td>Physical view, user ko nahi dikhta</td><td>User ke logical view se match</td></tr>\r\n<tr><td>Internal fragmentation</td><td>External fragmentation</td></tr>\r\n<tr><td>Page table: frame number</td><td>Segment table: base + limit</td></tr>\r\n</table>\r\n\r\n<h4>Segmentation with Paging</h4>\r\n<p>Dono ke fayde ek saath. Pehle program <b>segments</b> mein baanta, phir har <b>segment ko pages</b> mein. Logical address = (segment no, page no, offset). Segment table har segment ke <b>page table</b> ka address rakhti hai. External fragmentation nahi, sharing/protection acchhi. (Intel x86 isi tarah kaam karta hai.)</p>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 640 90\" width=\"640\">\r\n  <rect x=\"5\" y=\"25\" width=\"100\" height=\"40\" rx=\"6\" class=\"c1\"/><text x=\"55\" y=\"50\" text-anchor=\"middle\" font-size=\"13\" class=\"b\">(s, p, d)</text>\r\n  <path d=\"M105 45 H145\" class=\"ar\"/>\r\n  <rect x=\"150\" y=\"25\" width=\"120\" height=\"40\" rx=\"6\" class=\"c3\"/><text x=\"210\" y=\"50\" text-anchor=\"middle\" font-size=\"13\">Segment Table</text>\r\n  <path d=\"M270 45 H310\" class=\"ar\"/>\r\n  <rect x=\"315\" y=\"25\" width=\"120\" height=\"40\" rx=\"6\" class=\"c5\"/><text x=\"375\" y=\"50\" text-anchor=\"middle\" font-size=\"13\">Page Table of s</text>\r\n  <path d=\"M435 45 H475\" class=\"ar\"/>\r\n  <rect x=\"480\" y=\"25\" width=\"150\" height=\"40\" rx=\"6\" class=\"c2\"/><text x=\"555\" y=\"50\" text-anchor=\"middle\" font-size=\"13\">Frame f + offset d</text>\r\n</svg><div class=\"cap\">Fig 2.8: Segmentation with paging</div></div>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u2-vm",
        "title": "2.7 Virtual Memory aur Demand Paging",
        "html": "<h3>2.7 Virtual Memory aur Demand Paging</h3>\r\n<div class=\"def\"><b class=\"t\">Virtual Memory</b> Aisi technique jisme process ka <b>sirf zaruri hissa</b> physical memory mein hota hai. Isse program <b>physical memory se bada</b> ho sakta hai. Logical memory ko physical memory se alag kar diya jata hai. User ko bahut badi memory ka illusion milta hai.</div>\r\n<p>Fayde: bade programs, zyada processes ek saath (higher multiprogramming), kam I/O (poora program load nahi karna).</p>\r\n\r\n<h4>Demand Paging</h4>\r\n<p>Page ko memory mein tabhi laate hain jab uski <b>zarurat (demand)</b> ho, \"lazy swapper\". Page table mein <b>valid/invalid bit</b>: valid = page memory mein hai, invalid = nahi hai (ya disk par). Invalid page access = <b>Page Fault</b>.</p>\r\n\r\n<h4>Page Fault Handling ke Steps</h4>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 640 260\" width=\"640\">\r\n  <rect x=\"10\" y=\"20\" width=\"110\" height=\"40\" class=\"c1\"/><text x=\"65\" y=\"45\" text-anchor=\"middle\" class=\"b\">1. Reference</text>\r\n  <rect x=\"150\" y=\"20\" width=\"110\" height=\"40\" class=\"c6\"/><text x=\"205\" y=\"38\" text-anchor=\"middle\" class=\"b\" font-size=\"12\">2. Invalid bit:</text><text x=\"205\" y=\"52\" text-anchor=\"middle\" class=\"b\" font-size=\"12\">TRAP to OS</text>\r\n  <rect x=\"290\" y=\"20\" width=\"130\" height=\"40\" class=\"c3\"/><text x=\"355\" y=\"38\" text-anchor=\"middle\" font-size=\"12\">3. Valid reference?</text><text x=\"355\" y=\"52\" text-anchor=\"middle\" font-size=\"12\">page disk par hai</text>\r\n  <rect x=\"450\" y=\"20\" width=\"170\" height=\"40\" class=\"c5\"/><text x=\"535\" y=\"38\" text-anchor=\"middle\" font-size=\"12\">4. Free frame dhundho</text><text x=\"535\" y=\"52\" text-anchor=\"middle\" font-size=\"12\">(na ho to replace)</text>\r\n  <path d=\"M120 40 H150 M260 40 H290 M420 40 H450\" class=\"ar\"/>\r\n  <path d=\"M535 60 V100 H460\" class=\"ar\"/>\r\n  <rect x=\"290\" y=\"82\" width=\"170\" height=\"40\" class=\"c4\"/><text x=\"375\" y=\"100\" text-anchor=\"middle\" font-size=\"12\">5. Disk se page ko</text><text x=\"375\" y=\"114\" text-anchor=\"middle\" font-size=\"12\">frame mein padho (I/O)</text>\r\n  <path d=\"M290 102 H260\" class=\"ar\"/>\r\n  <rect x=\"100\" y=\"82\" width=\"160\" height=\"40\" class=\"c2\"/><text x=\"180\" y=\"100\" text-anchor=\"middle\" font-size=\"12\">6. Page table update</text><text x=\"180\" y=\"114\" text-anchor=\"middle\" font-size=\"12\">(valid bit = 1)</text>\r\n  <path d=\"M100 102 H65 V150\" class=\"ar\"/>\r\n  <rect x=\"10\" y=\"150\" width=\"190\" height=\"40\" class=\"c1\"/><text x=\"105\" y=\"168\" text-anchor=\"middle\" font-size=\"12\">7. Instruction dobara</text><text x=\"105\" y=\"182\" text-anchor=\"middle\" font-size=\"12\">restart karo</text>\r\n  <text x=\"420\" y=\"175\" class=\"lt\" font-size=\"13\">Page fault = bahut slow</text><text x=\"420\" y=\"195\" class=\"lt\" font-size=\"13\">(milliseconds), memory = nanoseconds</text>\r\n</svg><div class=\"cap\">Fig 2.9: Page fault handling</div></div>\r\n\r\n<div class=\"imp\"><b class=\"t\">Performance of Demand Paging</b>\r\nPage fault rate p (0 ≤ p ≤ 1).<br>\r\n<b>EAT = (1 − p) × memory access time + p × page fault service time</b><br>\r\nExample: memory access = 200 ns, page fault service = 8 ms = 8,000,000 ns, p = 1/1000.<br>\r\nEAT = 0.999 × 200 + 0.001 × 8,000,000 = 199.8 + 8000 = <b>≈ 8200 ns</b> (40 guna slowdown!). Isliye page fault rate bahut kam rakhna zaruri.</div>\r\n\r\n<h4>Page Replacement</h4>\r\n<p>Jab free frame nahi hota to kisi purane page ko <b>victim</b> bana kar nikaalte hain. <b>Modify (dirty) bit:</b> agar page badla nahi to disk par wapas likhna nahi padta (I/O bachta hai).</p>\r\n<table>\r\n<tr><th>Algorithm</th><th>Rule</th><th>Note</th></tr>\r\n<tr><td><b>FIFO</b></td><td>Sabse purana page nikalo</td><td>Simple. <b>Belady's anomaly</b> ho sakta hai (frames badhane par bhi faults badh jaye)</td></tr>\r\n<tr><td><b>Optimal (OPT)</b></td><td>Jo page <b>sabse der tak</b> use nahi hoga use nikalo</td><td>Sabse kam faults. Future pata chahiye, isliye implement nahi ho sakta (benchmark)</td></tr>\r\n<tr><td><b>LRU</b> (Least Recently Used)</td><td>Jo page sabse der se use nahi hua (past dekh kar)</td><td>OPT ke kareeb, no Belady. Implementation: counter ya stack</td></tr>\r\n<tr><td><b>LRU approximation</b></td><td>Reference bit, Second-chance (clock), Additional reference bits</td><td>Asli systems mein</td></tr>\r\n<tr><td><b>Counting based</b></td><td>LFU (least frequently used), MFU</td><td>Kam use hota</td></tr>\r\n</table>\r\n\r\n<div class=\"ex\"><b class=\"t\">Numerical (bahut puchha jata hai)</b> Reference string: 7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1, frames = 3.\r\n<br><b>FIFO = 15 page faults</b>, <b>LRU = 12 page faults</b>, <b>Optimal = 9 page faults</b>. (Simulator se verify karo.)</div>\r\n\r\n\r\n\r\n<h4>Belady's Anomaly</h4>\r\n<p>FIFO mein kabhi-kabhi <b>frames badhane par page faults kam hone ke bajaye badh jaate hain</b>. Example string: 1 2 3 4 1 2 5 1 2 3 4 5: 3 frames = 9 faults, 4 frames = 10 faults. LRU aur OPT (stack algorithms) mein ye nahi hota.</p>\r\n\r\n<h4>Allocation of Frames</h4>\r\n<ul>\r\n<li><b>Minimum frames:</b> instruction set ke hisaab se har process ko kuch minimum chahiye.</li>\r\n<li><b>Equal allocation:</b> m frames, n processes → m/n each.</li>\r\n<li><b>Proportional allocation:</b> process size ke ratio mein: a<sub>i</sub> = (s<sub>i</sub> / S) × m.</li>\r\n<li><b>Priority allocation:</b> high priority ko zyada.</li>\r\n<li><b>Global replacement:</b> kisi bhi process ka frame replace ho sakta. <b>Local replacement:</b> sirf apne frames mein se.</li>\r\n</ul>\r\n\r\n<h4>Thrashing</h4>\r\n<div class=\"def\"><b class=\"t\">Thrashing</b> Jab process <b>actual kaam se zyada samay paging (page faults)</b> mein bitata hai. CPU utilization girta hai, OS (galti se) aur processes load karta hai, aur halat aur kharab.</div>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 420 220\" width=\"420\">\r\n  <path d=\"M50 20 V180 H400\" class=\"ln\"/>\r\n  <path d=\"M50 175 C120 120 180 40 250 38 C300 38 320 90 390 170\" fill=\"none\" stroke=\"#3b82f6\" stroke-width=\"3\"/>\r\n  <circle cx=\"250\" cy=\"38\" r=\"5\" fill=\"#22c55e\"/><text x=\"250\" y=\"28\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">Best point</text>\r\n  <text x=\"340\" y=\"70\" class=\"lt\" font-size=\"13\" style=\"fill:#ef4444\">Thrashing</text>\r\n  <text x=\"225\" y=\"205\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">Degree of multiprogramming →</text>\r\n  <text x=\"6\" y=\"110\" class=\"lt\" font-size=\"12\" transform=\"rotate(-90 12 110)\">CPU utilization</text>\r\n</svg><div class=\"cap\">Fig 2.10: Thrashing</div></div>\r\n<ul>\r\n<li><b>Karan:</b> degree of multiprogramming bahut zyada, frames kam.</li>\r\n<li><b>Working-Set Model:</b> process ke recently use hue pages ka set (window Δ). Total working sets ka sum &lt; total frames rakho.</li>\r\n<li><b>Page-Fault Frequency (PFF):</b> fault rate ki upper aur lower limit. Upper se zyada to frame do, lower se kam to frame wapas lo.</li>\r\n<li>Local replacement use karne se bhi thrashing limit hoti hai.</li>\r\n</ul>\r\n\r\n<h4>Page Size aur Other Considerations</h4>\r\n<table>\r\n<tr><th>Page size chhota</th><th>Page size bada</th></tr>\r\n<tr><td>Internal fragmentation kam</td><td>Internal fragmentation zyada</td></tr>\r\n<tr><td>Page table bahut bada</td><td>Page table chhota</td></tr>\r\n<tr><td>I/O overhead zyada (kai transfers)</td><td>I/O transfer efficient</td></tr>\r\n<tr><td>Locality behtar</td><td>Locality kam (extra data load)</td></tr>\r\n</table>\r\n<p>Other: <b>TLB reach</b> (= entries × page size), <b>prepaging</b>, program structure (2D array access order), <b>I/O interlock</b> (pages ko lock karna), real-time processing.</p>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": true,
        "hasQuiz": false
      },
      {
        "id": "u2-qa",
        "title": "Unit 2: Predicted Questions",
        "html": "<h3>Unit 2: Predicted Exam Questions (with Answers)</h3>",
        "qas": [
          {
            "marks": "2M",
            "q": "Race condition kya hai?",
            "a": "Jab multiple processes shared data par ek saath kaam karein aur result execution order par depend kare. Example: count++ aur count-- ek saath."
          },
          {
            "marks": "4M",
            "q": "Critical section problem ke solution ki teen requirements likho.",
            "a": "Mutual exclusion, Progress, Bounded waiting. Har ek ki 1-2 line definition."
          },
          {
            "marks": "10M",
            "q": "Peterson's solution explain karo. Kya ye teeno conditions satisfy karta hai?",
            "a": "Shared: flag[2], turn. Code likho (Section 2.1). Mutual exclusion: dono CS mein hon to flag[0]=flag[1]=true aur turn ek hi value, jo possible nahi. Progress aur bounded waiting bhi satisfy. Limit: 2 processes."
          },
          {
            "marks": "4M",
            "q": "Semaphore kya hai? wait() aur signal() ke code likho. Binary aur counting semaphore mein antar.",
            "a": "Section 2.2 ke definitions. Binary 0/1 (mutex), counting unrestricted (multiple instances)."
          },
          {
            "marks": "10M",
            "q": "Producer-Consumer (bounded buffer) problem semaphores se solve karo.",
            "a": "mutex=1, empty=N, full=0. Producer: wait(empty), wait(mutex), add, signal(mutex), signal(full). Consumer: wait(full), wait(mutex), remove, signal(mutex), signal(empty)."
          },
          {
            "marks": "10M",
            "q": "Dining philosophers problem aur uska deadlock-free solution.",
            "a": "Fig 2.1, semaphore code, deadlock ka scenario (sab left chopstick utha lein). Solutions: max 4 philosophers, dono chopsticks atomically, asymmetric (odd left-first, even right-first), monitor."
          },
          {
            "marks": "4M",
            "q": "Monitor kya hai? Semaphore se kaise behtar?",
            "a": "High-level sync construct, andar ek time ek process, condition variables x.wait/x.signal. Automatic mutual exclusion, kam errors."
          },
          {
            "marks": "4M",
            "q": "Test-and-Set instruction ka code aur use likho.",
            "a": "Section 2.1 ka code. Atomic hai, lock variable ke saath spin karta. Mutual exclusion deta hai, bounded waiting nahi."
          },
          {
            "marks": "4M",
            "q": "Deadlock ki necessary conditions kya hain?",
            "a": "Mutual exclusion, hold and wait, no preemption, circular wait. Chaaron ek saath hon tabhi deadlock."
          },
          {
            "marks": "10M",
            "q": "Resource Allocation Graph se deadlock ko kaise detect karte hain? Diagram banao.",
            "a": "Fig 2.2. Request edge P→R, assignment edge R→P. Single instance: cycle = deadlock. Multiple instances: cycle zaruri par kaafi nahi. Wait-for graph se detection."
          },
          {
            "marks": "10M",
            "q": "Deadlock prevention ke methods explain karo.",
            "a": "Section 2.4 ka table: har condition ko kaise todte hain aur uske nuksan."
          },
          {
            "marks": "10M",
            "q": "Banker's algorithm explain karo. Numerical: safe sequence nikalo.",
            "a": "Data structures (Available, Max, Allocation, Need), Safety algorithm steps, Resource-request algorithm. Numerical mein pehle Need = Max − Allocation table, phir Work update karte hue sequence (example: P1, P3, P4, P2, P0). Simulator se practice."
          },
          {
            "marks": "4M",
            "q": "Safe state aur unsafe state mein difference.",
            "a": "Safe: safe sequence maujood, deadlock nahi. Unsafe: safe sequence nahi, deadlock ho sakta hai. Deadlock states unsafe ka subset (Fig 2.3)."
          },
          {
            "marks": "4M",
            "q": "Deadlock se recovery ke tareeke.",
            "a": "Process termination (sab ya ek-ek), resource preemption (victim selection, rollback, starvation)."
          },
          {
            "marks": "4M",
            "q": "Internal aur external fragmentation mein antar. Compaction kya hai?",
            "a": "Section 2.5 ka imp box. Compaction: free holes ko ek jagah jama karna (dynamic relocation chahiye)."
          },
          {
            "marks": "4M",
            "q": "First fit, best fit, worst fit compare karo.",
            "a": "Section 2.5 ka table. Chhota example (holes 100K, 500K, 200K, 300K, 600K aur processes 212K, 417K, 112K, 426K) se dikha sakte ho."
          },
          {
            "marks": "10M",
            "q": "Paging explain karo. Address translation hardware diagram ke saath. TLB ka role.",
            "a": "Fig 2.6, p/d split, page table, frame number, TLB hit/miss, EAT formula."
          },
          {
            "marks": "10M",
            "q": "Paging aur segmentation mein difference. Segmentation with paging kya hai?",
            "a": "Section 2.6 ka table, Fig 2.7 aur 2.8."
          },
          {
            "marks": "10M",
            "q": "Virtual memory aur demand paging explain karo. Page fault ke steps likho.",
            "a": "Definitions, valid/invalid bit, Fig 2.9 (7 steps), EAT formula."
          },
          {
            "marks": "10M",
            "q": "Numerical: FIFO, LRU, Optimal se page faults nikalo (frames = 3 ya 4).",
            "a": "Table banao: har reference par frames ki state, fault (F) ya hit (H). Ref string 7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1 par FIFO=15, LRU=12, OPT=9 (3 frames)."
          },
          {
            "marks": "4M",
            "q": "Belady's anomaly kya hai?",
            "a": "FIFO mein frames badhane par bhi page faults badh sakte hain (string 1 2 3 4 1 2 5 1 2 3 4 5: 3 frames → 9, 4 frames → 10)."
          },
          {
            "marks": "10M",
            "q": "Thrashing kya hai? Karan aur rokne ke tareeke.",
            "a": "Fig 2.10, working-set model, PFF, local replacement, multiprogramming degree control."
          },
          {
            "marks": "4M",
            "q": "Page size choose karte waqt kin baaton ka dhyan rakhna chahiye?",
            "a": "Section 2.7 ka table: fragmentation, page table size, I/O time, locality, TLB reach."
          }
        ],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": true
      }
    ],
    "quiz": [
      {
        "q": "Banker's algorithm kis ke liye hai?",
        "o": [
          "Deadlock prevention",
          "Deadlock avoidance",
          "Deadlock detection",
          "Recovery"
        ],
        "a": 1
      },
      {
        "q": "Deadlock ke liye kaun sa condition necessary NAHI hai?",
        "o": [
          "Mutual exclusion",
          "Hold and wait",
          "Preemption",
          "Circular wait"
        ],
        "a": 2
      },
      {
        "q": "Belady's anomaly kis algorithm mein ho sakta hai?",
        "o": [
          "LRU",
          "Optimal",
          "FIFO",
          "MRU"
        ],
        "a": 2
      },
      {
        "q": "Page size 1 KB hai. Logical address 3100 ka offset kya hoga?",
        "o": [
          "28",
          "100",
          "3",
          "1024"
        ],
        "a": 0
      },
      {
        "q": "Kis technique mein external fragmentation nahi hoti?",
        "o": [
          "Paging",
          "Segmentation",
          "Variable partition",
          "Contiguous allocation"
        ],
        "a": 0
      },
      {
        "q": "Mutual exclusion ke liye mutex semaphore ki initial value?",
        "o": [
          "0",
          "1",
          "-1",
          "N"
        ],
        "a": 1
      },
      {
        "q": "Thrashing mein kya hota hai?",
        "o": [
          "CPU bahut busy",
          "Process execute se zyada paging mein samay lagata hai",
          "Disk full",
          "Memory leak"
        ],
        "a": 1
      },
      {
        "q": "Optimal page replacement kaun sa page nikalta hai?",
        "o": [
          "Sabse purana",
          "Sabse kam use hua",
          "Jo sabse der tak use nahi hoga",
          "Random"
        ],
        "a": 2
      }
    ]
  },
  {
    "id": "u3",
    "number": 3,
    "title": "Unit 3: Open Source Software & Linux Basics",
    "desc": "Linux architecture, kernel vs shell, file system, inode structure, superblock, standard commands, process management, signals, and system calls.",
    "topics": [
      {
        "id": "u3-intro",
        "title": "3.1 Open Source aur Linux Intro",
        "html": "<h3>3.1 Open Source Software aur Linux ka Introduction</h3>\r\n<div class=\"def\"><b class=\"t\">Open Source Software (OSS)</b> Aisa software jiska <b>source code public</b> hota hai. Koi bhi use dekh sakta hai, badal sakta hai aur distribute kar sakta hai (license ke andar). Example: Linux, Apache, MySQL, Firefox, Python, Android (AOSP).</div>\r\n<table>\r\n<tr><th>Open Source</th><th>Closed Source (Proprietary)</th></tr>\r\n<tr><td>Source code available</td><td>Source code company ke paas</td></tr>\r\n<tr><td>Free ya sasta, community support</td><td>License fee, official support</td></tr>\r\n<tr><td>Customize kar sakte ho</td><td>Customize nahi</td></tr>\r\n<tr><td>Linux, LibreOffice</td><td>Windows, MS Office</td></tr>\r\n</table>\r\n<p><b>Free Software Foundation (FSF)</b> aur <b>GNU GPL (General Public License)</b>: Richard Stallman ka movement. GPL kehta hai ki code free rahe aur modify kiya hua code bhi usi license mein share ho (copyleft).</p>\r\n\r\n<h4>Evolution of Linux</h4>\r\n<table>\r\n<tr><th>Saal</th><th>Ghatna</th></tr>\r\n<tr><td>1969</td><td>Ken Thompson aur Dennis Ritchie (Bell Labs) ne <b>UNIX</b> banaya</td></tr>\r\n<tr><td>1983-85</td><td>Richard Stallman ka <b>GNU project</b> (free UNIX-like OS, par kernel nahi tha)</td></tr>\r\n<tr><td>1987</td><td>Andrew Tanenbaum ka <b>MINIX</b> (teaching OS)</td></tr>\r\n<tr><td>1991</td><td><b>Linus Torvalds</b> (Helsinki University student) ne Linux kernel 0.01 release kiya</td></tr>\r\n<tr><td>1992</td><td>Linux ko GPL license mila, GNU tools ke saath mila: <b>GNU/Linux</b></td></tr>\r\n<tr><td>Aaj</td><td>Servers, supercomputers (top 500 mein 100%), Android, embedded, cloud</td></tr>\r\n</table>\r\n<div class=\"imp\"><b class=\"t\">Yaad rakho</b> \"Linux\" technically sirf <b>kernel</b> hai. Poora OS = Linux kernel + GNU tools + shell + libraries + apps.</div>\r\n\r\n<h4>Linux vs UNIX</h4>\r\n<table>\r\n<tr><th>Point</th><th>Linux</th><th>UNIX</th></tr>\r\n<tr><td>Cost</td><td>Free (mostly), open source</td><td>Commercial (AIX, HP-UX, Solaris)</td></tr>\r\n<tr><td>Developer</td><td>Linus Torvalds + community</td><td>AT&amp;T Bell Labs, vendors</td></tr>\r\n<tr><td>Source code</td><td>Open</td><td>Mostly closed</td></tr>\r\n<tr><td>Hardware</td><td>Almost sab (PC, phone, server)</td><td>Specific vendor hardware</td></tr>\r\n<tr><td>Default shell</td><td>Bash</td><td>Bourne / Korn shell</td></tr>\r\n<tr><td>File systems</td><td>ext3, ext4, XFS, Btrfs</td><td>JFS, ZFS, UFS</td></tr>\r\n<tr><td>Use</td><td>Desktop, server, mobile</td><td>Mainly servers, workstations</td></tr>\r\n</table>\r\n\r\n<h4>Linux ke Features</h4>\r\n<ul>\r\n<li><b>Multiuser</b> aur <b>multitasking</b>, <b>multiprocessing</b></li>\r\n<li><b>Portable</b> (kai hardware par), <b>open source</b>, <b>secure</b> (permissions, firewall)</li>\r\n<li>Hierarchical file system, powerful <b>shell</b> aur scripting</li>\r\n<li>Stable, kam resources mein chalta hai, virus risk kam</li>\r\n</ul>\r\n\r\n<h4>Different Distributions (Distros) of Linux</h4>\r\n<p>Distribution = Linux kernel + software packages + package manager + installer. Alag-alag companies/communities alag distros banati hain.</p>\r\n<table>\r\n<tr><th>Family</th><th>Distros</th><th>Package Manager</th></tr>\r\n<tr><td>Debian</td><td>Debian, <b>Ubuntu</b>, Linux Mint, Kali Linux</td><td>apt, dpkg (.deb)</td></tr>\r\n<tr><td>Red Hat</td><td><b>RHEL</b>, <b>Fedora</b>, CentOS, Rocky/Alma</td><td>yum / dnf, rpm (.rpm)</td></tr>\r\n<tr><td>SUSE</td><td>openSUSE, SLES</td><td>zypper, rpm</td></tr>\r\n<tr><td>Arch</td><td>Arch Linux, Manjaro</td><td>pacman</td></tr>\r\n<tr><td>Others</td><td>Slackware, Gentoo, Android (Linux kernel based)</td><td>-</td></tr>\r\n</table>\r\n\r\n<h4>Installing Linux (Steps)</h4>\r\n<ol>\r\n<li>Distro ka <b>ISO</b> download karo (jaise Ubuntu).</li>\r\n<li><b>Bootable USB</b> banao (Rufus, balenaEtcher) ya DVD burn karo.</li>\r\n<li>BIOS/UEFI mein <b>boot order</b> change karke USB se boot karo (ya VirtualBox mein VM banao).</li>\r\n<li>Installer mein: language, keyboard, <b>\"Try / Install\"</b> choose karo.</li>\r\n<li><b>Partitioning:</b> / (root), swap, /home (optional). Dual-boot ho to Windows ke saath space do.</li>\r\n<li><b>Time zone, user name, password</b> set karo.</li>\r\n<li><b>Boot loader (GRUB)</b> install hota hai. Restart.</li>\r\n</ol>\r\n<p><b>Partitions:</b> <code>/</code> root (zaruri), <code>swap</code> (virtual memory, RAM jitna ya kam), <code>/boot</code>, <code>/home</code> (user data).</p>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u3-arch",
        "title": "3.2 Linux Architecture aur Kernel",
        "html": "<h3>3.2 Linux Architecture aur Kernel</h3>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 560 330\" width=\"560\">\r\n  <rect x=\"30\" y=\"10\" width=\"500\" height=\"50\" class=\"c3\"/><text x=\"280\" y=\"32\" text-anchor=\"middle\" class=\"b\">User Applications</text><text x=\"280\" y=\"50\" text-anchor=\"middle\" font-size=\"12\">Browser, Editors, Compilers, user programs</text>\r\n  <rect x=\"30\" y=\"64\" width=\"500\" height=\"50\" class=\"c4\"/><text x=\"280\" y=\"86\" text-anchor=\"middle\" class=\"b\">Shell</text><text x=\"280\" y=\"104\" text-anchor=\"middle\" font-size=\"12\">bash, csh, ksh: command interpreter (user ↔ kernel)</text>\r\n  <rect x=\"30\" y=\"118\" width=\"500\" height=\"44\" class=\"c5\"/><text x=\"280\" y=\"138\" text-anchor=\"middle\" class=\"b\">System Libraries / System Call Interface</text><text x=\"280\" y=\"154\" text-anchor=\"middle\" font-size=\"12\">glibc: open(), read(), fork()...</text>\r\n  <rect x=\"30\" y=\"166\" width=\"500\" height=\"94\" class=\"c1\"/><text x=\"280\" y=\"186\" text-anchor=\"middle\" class=\"b\">KERNEL</text>\r\n  <rect x=\"45\" y=\"196\" width=\"105\" height=\"54\" class=\"c2\"/><text x=\"97\" y=\"218\" text-anchor=\"middle\" font-size=\"12\">Process Mgmt</text><text x=\"97\" y=\"234\" text-anchor=\"middle\" font-size=\"11\">(scheduler)</text>\r\n  <rect x=\"158\" y=\"196\" width=\"105\" height=\"54\" class=\"c2\"/><text x=\"210\" y=\"218\" text-anchor=\"middle\" font-size=\"12\">Memory Mgmt</text><text x=\"210\" y=\"234\" text-anchor=\"middle\" font-size=\"11\">(paging, VM)</text>\r\n  <rect x=\"271\" y=\"196\" width=\"105\" height=\"54\" class=\"c2\"/><text x=\"323\" y=\"218\" text-anchor=\"middle\" font-size=\"12\">File System</text><text x=\"323\" y=\"234\" text-anchor=\"middle\" font-size=\"11\">(VFS, ext4)</text>\r\n  <rect x=\"384\" y=\"196\" width=\"135\" height=\"54\" class=\"c2\"/><text x=\"451\" y=\"218\" text-anchor=\"middle\" font-size=\"12\">Device Drivers</text><text x=\"451\" y=\"234\" text-anchor=\"middle\" font-size=\"11\">+ Networking</text>\r\n  <rect x=\"30\" y=\"268\" width=\"500\" height=\"44\" class=\"c7\"/><text x=\"280\" y=\"294\" text-anchor=\"middle\" class=\"b\">Hardware (CPU, RAM, Disk, NIC)</text>\r\n  <path d=\"M10 20 V300\" class=\"ar\"/>\r\n</svg><div class=\"cap\">Fig 3.1: Linux architecture</div></div>\r\n<h4>Kernel</h4>\r\n<div class=\"def\"><b class=\"t\">Kernel</b> OS ka core part jo hardware se directly baat karta hai. Ye hamesha memory mein rehta hai, aur CPU, memory, devices, files, security manage karta hai. Linux kernel <b>monolithic</b> hai par <b>loadable modules</b> (LKM) support karta hai.</div>\r\n<ul>\r\n<li><b>Process management:</b> create, schedule (CFS), terminate</li>\r\n<li><b>Memory management:</b> virtual memory, paging, swapping</li>\r\n<li><b>File system management:</b> VFS (Virtual File System) jo ext4, NTFS, FAT sab ko ek interface deta hai</li>\r\n<li><b>Device management:</b> device drivers (<code>/dev</code> files)</li>\r\n<li><b>Networking:</b> TCP/IP stack</li>\r\n<li><b>Security:</b> users, permissions</li>\r\n</ul>\r\n<p>Kernel version dekhne ke liye: <code>uname -r</code></p>\r\n\r\n<h4>Kernel Mode aur User Mode</h4>\r\n<p>User programs <b>user space</b> mein, kernel code <b>kernel space</b> mein. System call se user mode → kernel mode switch hota hai (Unit 1.4).</p>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u3-fs",
        "title": "3.3 Linux File System (inode, superblock, mount)",
        "html": "<h3>3.3 Linux File System: inode, Superblock, Mounting/Unmounting</h3>\r\n<p>Linux mein <b>\"Everything is a file\"</b>: regular files, directories, devices, pipes sab file ki tarah treat hote hain.</p>\r\n\r\n<h4>Directory Structure (FHS)</h4>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 640 230\" width=\"640\">\r\n  <rect x=\"290\" y=\"5\" width=\"60\" height=\"30\" rx=\"6\" class=\"c1\"/><text x=\"320\" y=\"25\" text-anchor=\"middle\" class=\"b\">/ (root)</text>\r\n  <path d=\"M320 35 V55 M60 55 H590 M60 55 V70 M130 55 V70 M200 55 V70 M270 55 V70 M340 55 V70 M410 55 V70 M480 55 V70 M550 55 V70 M590 55 V70\" class=\"ln\"/>\r\n  <g font-size=\"12\">\r\n  <rect x=\"30\" y=\"70\" width=\"60\" height=\"28\" rx=\"5\" class=\"c2\"/><text x=\"60\" y=\"89\" text-anchor=\"middle\">/bin</text>\r\n  <rect x=\"100\" y=\"70\" width=\"60\" height=\"28\" rx=\"5\" class=\"c2\"/><text x=\"130\" y=\"89\" text-anchor=\"middle\">/boot</text>\r\n  <rect x=\"170\" y=\"70\" width=\"60\" height=\"28\" rx=\"5\" class=\"c2\"/><text x=\"200\" y=\"89\" text-anchor=\"middle\">/dev</text>\r\n  <rect x=\"240\" y=\"70\" width=\"60\" height=\"28\" rx=\"5\" class=\"c3\"/><text x=\"270\" y=\"89\" text-anchor=\"middle\">/etc</text>\r\n  <rect x=\"310\" y=\"70\" width=\"60\" height=\"28\" rx=\"5\" class=\"c3\"/><text x=\"340\" y=\"89\" text-anchor=\"middle\">/home</text>\r\n  <rect x=\"380\" y=\"70\" width=\"60\" height=\"28\" rx=\"5\" class=\"c2\"/><text x=\"410\" y=\"89\" text-anchor=\"middle\">/lib</text>\r\n  <rect x=\"450\" y=\"70\" width=\"60\" height=\"28\" rx=\"5\" class=\"c2\"/><text x=\"480\" y=\"89\" text-anchor=\"middle\">/proc</text>\r\n  <rect x=\"520\" y=\"70\" width=\"60\" height=\"28\" rx=\"5\" class=\"c2\"/><text x=\"550\" y=\"89\" text-anchor=\"middle\">/tmp</text>\r\n  <rect x=\"590\" y=\"70\" width=\"46\" height=\"28\" rx=\"5\" class=\"c2\"/><text x=\"613\" y=\"89\" text-anchor=\"middle\">/usr</text>\r\n  </g>\r\n  <text x=\"320\" y=\"135\" text-anchor=\"middle\" class=\"lt\" font-size=\"13\">/var (logs, mail), /root (admin home), /mnt (mount point), /sbin (admin commands), /opt</text>\r\n  <text x=\"320\" y=\"160\" text-anchor=\"middle\" class=\"lt\" font-size=\"13\">/home/rahul/notes.txt → path (absolute path \"/\" se shuru)</text>\r\n</svg><div class=\"cap\">Fig 3.2: Linux directory hierarchy</div></div>\r\n<table>\r\n<tr><th>Directory</th><th>Kaam</th></tr>\r\n<tr><td><code>/</code></td><td>Root, sab kuch iske andar</td></tr>\r\n<tr><td><code>/bin</code>, <code>/sbin</code></td><td>Essential commands (ls, cp) / admin commands</td></tr>\r\n<tr><td><code>/boot</code></td><td>Kernel aur boot loader files</td></tr>\r\n<tr><td><code>/dev</code></td><td>Device files (sda, tty, null)</td></tr>\r\n<tr><td><code>/etc</code></td><td>System configuration files (passwd, fstab)</td></tr>\r\n<tr><td><code>/home</code></td><td>Users ki home directories</td></tr>\r\n<tr><td><code>/proc</code></td><td>Virtual FS: running processes aur kernel info</td></tr>\r\n<tr><td><code>/var</code></td><td>Variable data: logs, mail, spool</td></tr>\r\n<tr><td><code>/tmp</code></td><td>Temporary files</td></tr>\r\n<tr><td><code>/usr</code></td><td>User programs, libraries</td></tr>\r\n<tr><td><code>/mnt</code>, <code>/media</code></td><td>Mount points (USB, disks)</td></tr>\r\n</table>\r\n\r\n<h4>Linux File System Layout (disk par)</h4>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 620 90\" width=\"620\">\r\n  <rect x=\"10\" y=\"25\" width=\"90\" height=\"40\" class=\"c7\"/><text x=\"55\" y=\"50\" text-anchor=\"middle\" font-size=\"13\">Boot Block</text>\r\n  <rect x=\"100\" y=\"25\" width=\"110\" height=\"40\" class=\"c6\"/><text x=\"155\" y=\"50\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">Super Block</text>\r\n  <rect x=\"210\" y=\"25\" width=\"130\" height=\"40\" class=\"c3\"/><text x=\"275\" y=\"50\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">Inode Table</text>\r\n  <rect x=\"340\" y=\"25\" width=\"270\" height=\"40\" class=\"c2\"/><text x=\"475\" y=\"50\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">Data Blocks (file contents)</text>\r\n</svg><div class=\"cap\">Fig 3.3: Disk partition ka layout</div></div>\r\n<ul>\r\n<li><b>Boot block:</b> boot loader code (bootstrap).</li>\r\n<li><b>Superblock:</b> poore file system ki <b>metadata</b>: total size, block size, free blocks ki sankhya, free inodes, file system type/state. Corrupt ho jaye to FS mount nahi hota (isliye backup copies hoti hain).</li>\r\n<li><b>Inode table:</b> har file ka inode.</li>\r\n<li><b>Data blocks:</b> files ka asli data.</li>\r\n</ul>\r\n\r\n<h4>inode</h4>\r\n<div class=\"def\"><b class=\"t\">inode (index node)</b> Ek data structure jisme file ki <b>saari information (naam ko chhod kar)</b> hoti hai. Har file ka ek <b>unique inode number</b> hota hai. File ka naam directory mein hota hai, jo naam ko inode number se map karti hai.</div>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 620 270\" width=\"620\">\r\n  <rect x=\"10\" y=\"30\" width=\"120\" height=\"50\" class=\"c1\"/><text x=\"70\" y=\"52\" text-anchor=\"middle\" font-size=\"12\">Directory entry</text><text x=\"70\" y=\"68\" text-anchor=\"middle\" font-size=\"12\">notes.txt → 4521</text>\r\n  <path d=\"M130 55 H175\" class=\"ar\"/>\r\n  <rect x=\"180\" y=\"5\" width=\"170\" height=\"260\" class=\"c3\"/><text x=\"265\" y=\"24\" text-anchor=\"middle\" class=\"b\">Inode 4521</text>\r\n  <text x=\"195\" y=\"48\" font-size=\"12\">File type + permissions</text><text x=\"195\" y=\"68\" font-size=\"12\">Owner (UID), Group (GID)</text><text x=\"195\" y=\"88\" font-size=\"12\">File size</text><text x=\"195\" y=\"108\" font-size=\"12\">Timestamps (atime, mtime, ctime)</text><text x=\"195\" y=\"128\" font-size=\"12\">Link count</text>\r\n  <rect x=\"190\" y=\"140\" width=\"150\" height=\"116\" fill=\"none\" class=\"ln\"/>\r\n  <text x=\"265\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" class=\"b\">Block pointers</text>\r\n  <text x=\"200\" y=\"178\" font-size=\"12\">12 Direct → data blocks</text><text x=\"200\" y=\"198\" font-size=\"12\">1 Single indirect</text><text x=\"200\" y=\"218\" font-size=\"12\">1 Double indirect</text><text x=\"200\" y=\"238\" font-size=\"12\">1 Triple indirect</text>\r\n  <path d=\"M340 175 L420 150\" class=\"ar\"/><rect x=\"425\" y=\"130\" width=\"90\" height=\"36\" class=\"c2\"/><text x=\"470\" y=\"153\" text-anchor=\"middle\" font-size=\"12\">Data block</text>\r\n  <path d=\"M340 198 L420 208\" class=\"ar\"/><rect x=\"425\" y=\"190\" width=\"90\" height=\"36\" class=\"c4\"/><text x=\"470\" y=\"206\" text-anchor=\"middle\" font-size=\"11\">Index block →</text><text x=\"470\" y=\"219\" text-anchor=\"middle\" font-size=\"11\">data blocks</text>\r\n</svg><div class=\"cap\">Fig 3.4: inode structure</div></div>\r\n<p><b>Commands:</b> <code>ls -i</code> (inode number dekho), <code>stat file</code> (inode ki details), <code>df -i</code> (inode usage).</p>\r\n<div class=\"imp\"><b class=\"t\">Hard link vs Soft link</b>\r\n<b>Hard link</b> (<code>ln a b</code>): same inode, naya naam. Original delete hone par bhi data bacha rehta (link count &gt; 0). Directories/alag FS par nahi. <b>Soft (symbolic) link</b> (<code>ln -s a b</code>): alag inode, jisme path likha hota hai. Original delete = link \"broken\".</div>\r\n\r\n<h4>Mounting aur Unmounting</h4>\r\n<div class=\"def\"><b class=\"t\">Mount</b> Kisi file system (partition, USB, CD) ko existing directory tree ke kisi <b>mount point</b> par jodna, taaki uski files access ho sakein. <b>Unmount:</b> safely alag karna (pending writes disk par likh kar).</div>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 620 170\" width=\"620\">\r\n  <text x=\"130\" y=\"14\" text-anchor=\"middle\" class=\"b lt\" font-size=\"13\">Mount se pehle</text>\r\n  <rect x=\"100\" y=\"22\" width=\"60\" height=\"26\" rx=\"5\" class=\"c1\"/><text x=\"130\" y=\"40\" text-anchor=\"middle\" font-size=\"12\">/</text>\r\n  <path d=\"M130 48 V70\" class=\"ln\"/><rect x=\"95\" y=\"70\" width=\"70\" height=\"26\" rx=\"5\" class=\"c2\"/><text x=\"130\" y=\"88\" text-anchor=\"middle\" font-size=\"12\">/mnt (khali)</text>\r\n  <rect x=\"20\" y=\"115\" width=\"200\" height=\"40\" class=\"c3\"/><text x=\"120\" y=\"139\" text-anchor=\"middle\" font-size=\"12\">USB (/dev/sdb1): docs/ pics/</text>\r\n  <path d=\"M250 85 H300\" class=\"ar\"/><text x=\"275\" y=\"75\" text-anchor=\"middle\" class=\"lt\" font-size=\"11\">mount</text>\r\n  <text x=\"470\" y=\"14\" text-anchor=\"middle\" class=\"b lt\" font-size=\"13\">Mount ke baad</text>\r\n  <rect x=\"440\" y=\"22\" width=\"60\" height=\"26\" rx=\"5\" class=\"c1\"/><text x=\"470\" y=\"40\" text-anchor=\"middle\" font-size=\"12\">/</text>\r\n  <path d=\"M470 48 V70\" class=\"ln\"/><rect x=\"435\" y=\"70\" width=\"70\" height=\"26\" rx=\"5\" class=\"c2\"/><text x=\"470\" y=\"88\" text-anchor=\"middle\" font-size=\"12\">/mnt</text>\r\n  <path d=\"M470 96 V115\" class=\"ln\"/><rect x=\"410\" y=\"115\" width=\"60\" height=\"26\" rx=\"5\" class=\"c3\"/><text x=\"440\" y=\"133\" text-anchor=\"middle\" font-size=\"12\">docs</text><rect x=\"480\" y=\"115\" width=\"60\" height=\"26\" rx=\"5\" class=\"c3\"/><text x=\"510\" y=\"133\" text-anchor=\"middle\" font-size=\"12\">pics</text>\r\n  <path d=\"M470 96 L440 115 M470 96 L510 115\" class=\"ln\"/>\r\n  <text x=\"470\" y=\"160\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">Ab /mnt/docs se USB ka data milega</text>\r\n</svg><div class=\"cap\">Fig 3.5: Mounting</div></div>\r\n<pre><code>mount /dev/sdb1 /mnt      # mount karo\r\nmount                     # abhi mounted FS list\r\ndf -h                     # disk usage\r\numount /mnt               # unmount (note: \"umount\", \"unmount\" nahi)\r\n# Permanent mount: /etc/fstab file mein entry</code></pre>\r\n<p>Agar koi process mount point ke andar kaam kar raha ho to <code>umount</code> \"target is busy\" error dega.</p>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u3-cmds",
        "title": "3.4 Essential Linux Commands",
        "html": "<h3>3.4 Essential Linux Commands (Internal aur External)</h3>\r\n<table>\r\n<tr><th>Internal Commands (Built-in)</th><th>External Commands</th></tr>\r\n<tr><td>Shell ke andar hi bane hote hain, alag file nahi</td><td>Alag executable file disk par (<code>/bin</code>, <code>/usr/bin</code>)</td></tr>\r\n<tr><td>Fast (naya process nahi banta)</td><td>Slightly slow (fork + exec)</td></tr>\r\n<tr><td>cd, echo, pwd, export, alias, history, exit, read, set, source, type</td><td>ls, cp, mv, rm, cat, grep, ps, find, sort, wc, chmod</td></tr>\r\n<tr><td>Check: <code>type cd</code> → \"shell builtin\"</td><td>Check: <code>which ls</code> → /bin/ls</td></tr>\r\n</table>\r\n\r\n<h4>Important Commands (Category wise)</h4>\r\n<table>\r\n<tr><th>Category</th><th>Command</th><th>Kaam / Example</th></tr>\r\n<tr><td rowspan=\"6\">Directory &amp; Navigation</td><td><code>pwd</code></td><td>Current directory dikhao</td></tr>\r\n<tr><td><code>ls</code></td><td>List: <code>ls -l</code> (long), <code>ls -a</code> (hidden), <code>ls -lh</code>, <code>ls -R</code></td></tr>\r\n<tr><td><code>cd</code></td><td><code>cd /home</code>, <code>cd ..</code> (upar), <code>cd ~</code> (home), <code>cd -</code> (pichla)</td></tr>\r\n<tr><td><code>mkdir</code></td><td><code>mkdir dir</code>, <code>mkdir -p a/b/c</code></td></tr>\r\n<tr><td><code>rmdir</code></td><td>Khali directory hatao</td></tr>\r\n<tr><td><code>tree</code></td><td>Directory tree view</td></tr>\r\n<tr><td rowspan=\"8\">File handling</td><td><code>cat</code></td><td><code>cat f1</code>, <code>cat f1 f2 &gt; f3</code></td></tr>\r\n<tr><td><code>touch</code></td><td>Khali file banao / timestamp update</td></tr>\r\n<tr><td><code>cp</code></td><td><code>cp a b</code>, <code>cp -r dir1 dir2</code></td></tr>\r\n<tr><td><code>mv</code></td><td>Move ya rename: <code>mv old new</code></td></tr>\r\n<tr><td><code>rm</code></td><td><code>rm f</code>, <code>rm -r dir</code>, <code>rm -f</code> (force), <code>rm -i</code> (poochh kar)</td></tr>\r\n<tr><td><code>more / less</code></td><td>Page by page dekho</td></tr>\r\n<tr><td><code>head / tail</code></td><td>Pehli / aakhri 10 lines (<code>-n 5</code>), <code>tail -f</code> (live log)</td></tr>\r\n<tr><td><code>wc</code></td><td>Lines, words, chars count (<code>-l -w -c</code>)</td></tr>\r\n<tr><td rowspan=\"4\">Searching</td><td><code>grep</code></td><td><code>grep \"text\" file</code>, <code>-i</code> (ignore case), <code>-n</code>, <code>-r</code>, <code>-v</code> (ulta)</td></tr>\r\n<tr><td><code>find</code></td><td><code>find / -name \"a.txt\"</code>, <code>find . -size +1M</code></td></tr>\r\n<tr><td><code>locate / which / whereis</code></td><td>File/command ka location</td></tr>\r\n<tr><td><code>sort / uniq / cut</code></td><td>Text processing</td></tr>\r\n<tr><td rowspan=\"4\">Process</td><td><code>ps</code></td><td><code>ps</code>, <code>ps -ef</code>, <code>ps aux</code></td></tr>\r\n<tr><td><code>top / htop</code></td><td>Live process monitor</td></tr>\r\n<tr><td><code>kill</code></td><td><code>kill PID</code>, <code>kill -9 PID</code></td></tr>\r\n<tr><td><code>bg / fg / jobs / &amp; / nice</code></td><td>Job control, priority</td></tr>\r\n<tr><td rowspan=\"5\">System info</td><td><code>date, cal</code></td><td>Date, calendar</td></tr>\r\n<tr><td><code>whoami, who, id, w</code></td><td>User info</td></tr>\r\n<tr><td><code>uname -a</code></td><td>Kernel/system info</td></tr>\r\n<tr><td><code>df, du, free</code></td><td>Disk usage, memory usage</td></tr>\r\n<tr><td><code>man, --help, info</code></td><td>Help / manual</td></tr>\r\n<tr><td rowspan=\"3\">Permissions</td><td><code>chmod, chown, chgrp</code></td><td>Unit 5 mein detail</td></tr>\r\n<tr><td><code>su, sudo</code></td><td>User badlo / admin power</td></tr>\r\n<tr><td><code>passwd</code></td><td>Password badlo</td></tr>\r\n<tr><td rowspan=\"3\">Archive / Network</td><td><code>tar, gzip, zip</code></td><td><code>tar -cvf a.tar dir</code>, <code>tar -xvf a.tar</code></td></tr>\r\n<tr><td><code>ping, ifconfig / ip, ssh, wget, curl</code></td><td>Network</td></tr>\r\n<tr><td><code>apt install / yum install</code></td><td>Package install</td></tr>\r\n</table>\r\n<div class=\"exam\"><b class=\"t\">Exam Tip</b> Command likhte waqt <b>syntax + ek example + output ka matlab</b> likho. Jaise: <code>ls -l</code> → long listing (permissions, owner, size, date, name).</div>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u3-process",
        "title": "3.5 Process Mgmt in Linux aur Signals",
        "html": "<h3>3.5 Process Management in Linux</h3>\r\n<ul>\r\n<li>Har process ka unique <b>PID</b> aur <b>PPID</b> (parent ka PID). <b>init/systemd (PID 1)</b> sabka ultimate parent.</li>\r\n<li>Process creation: <b><code>fork()</code></b> se copy banti hai, phir <b><code>exec()</code></b> se nayi program load.</li>\r\n<li><b>Foreground</b> aur <b>background</b> (<code>command &amp;</code>) processes. <code>Ctrl+Z</code> suspend, <code>bg</code>, <code>fg</code>.</li>\r\n</ul>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 720 220\" width=\"720\">\r\n  <rect x=\"10\" y=\"8\" width=\"150\" height=\"40\" rx=\"8\" class=\"c1\"/><text x=\"85\" y=\"33\" text-anchor=\"middle\" class=\"b\">Parent (PID 100)</text>\r\n  <path d=\"M85 48 V82\" class=\"ar\"/><text x=\"95\" y=\"70\" class=\"lt\">fork()</text>\r\n  <rect x=\"10\" y=\"84\" width=\"190\" height=\"46\" rx=\"8\" class=\"c1\"/><text x=\"105\" y=\"104\" text-anchor=\"middle\">Parent: fork() returns</text><text x=\"105\" y=\"120\" text-anchor=\"middle\">child ka PID (101)</text>\r\n  <path d=\"M160 28 C300 28 340 40 340 82\" class=\"ar\"/><text x=\"235\" y=\"22\" class=\"lt\">child ban gaya (copy)</text>\r\n  <rect x=\"255\" y=\"84\" width=\"190\" height=\"46\" rx=\"8\" class=\"c3\"/><text x=\"350\" y=\"104\" text-anchor=\"middle\">Child (PID 101):</text><text x=\"350\" y=\"120\" text-anchor=\"middle\">fork() returns 0</text>\r\n  <path d=\"M350 130 V160\" class=\"ar\"/><text x=\"360\" y=\"150\" class=\"lt\">exec(\"ls\")</text>\r\n  <rect x=\"255\" y=\"162\" width=\"190\" height=\"40\" rx=\"8\" class=\"c2\"/><text x=\"350\" y=\"187\" text-anchor=\"middle\">Naya program chala</text>\r\n  <path d=\"M85 130 V182 H253\" class=\"ar\"/><text x=\"100\" y=\"176\" class=\"lt\">wait(): child ka intezaar</text>\r\n  <path d=\"M445 182 H500\" class=\"ar\"/><text x=\"508\" y=\"180\" class=\"lt\">exit() se status</text><text x=\"508\" y=\"196\" class=\"lt\">parent ko milta hai</text>\r\n</svg><div class=\"cap\">Fig 3.6: fork, exec, wait, exit</div></div>\r\n\r\n<h4>Linux Process States</h4>\r\n<table>\r\n<tr><th>State</th><th>Code (ps)</th><th>Matlab</th></tr>\r\n<tr><td>Running / Runnable</td><td>R</td><td>CPU par ya ready queue mein</td></tr>\r\n<tr><td>Interruptible sleep</td><td>S</td><td>Event ka wait (signal se jag sakta)</td></tr>\r\n<tr><td>Uninterruptible sleep</td><td>D</td><td>I/O wait (signal se nahi jagta)</td></tr>\r\n<tr><td>Stopped</td><td>T</td><td>Ctrl+Z ya SIGSTOP se roka hua</td></tr>\r\n<tr><td><b>Zombie</b></td><td>Z</td><td>Process khatam, par parent ne <code>wait()</code> nahi kiya, PCB entry baki</td></tr>\r\n</table>\r\n<div class=\"imp\"><b class=\"t\">Zombie vs Orphan</b>\r\n<b>Zombie:</b> child exit ho gaya par parent ne status collect nahi kiya (process table mein entry). <b>Orphan:</b> parent pehle khatam ho gaya, child ko init (PID 1) <b>adopt</b> kar leta hai.</div>\r\n<pre><code>ps -ef | grep firefox     # process dhundo\r\ntop                        # live\r\nkill -9 1234               # force kill (SIGKILL)\r\nnice -n 10 ./prog          # kam priority se chalao\r\nrenice -n 5 -p 1234        # chalte process ki priority\r\nsleep 100 &amp;                # background mein\r\njobs; fg %1                # jobs list, foreground mein laao</code></pre>\r\n\r\n<h3 style=\"margin-top:22px;border-top:2px solid var(--line);padding-top:14px\">Signal Handling</h3>\r\n<div class=\"def\"><b class=\"t\">Signal</b> Process ko bheja gaya ek <b>software interrupt</b> jo kisi event ki suchna deta hai (jaise Ctrl+C, illegal memory access, timer khatam).</div>\r\n<table>\r\n<tr><th>Signal</th><th>No.</th><th>Matlab</th><th>Default action</th></tr>\r\n<tr><td>SIGHUP</td><td>1</td><td>Terminal band (hangup), config reload</td><td>Terminate</td></tr>\r\n<tr><td>SIGINT</td><td>2</td><td>Ctrl+C: interrupt</td><td>Terminate</td></tr>\r\n<tr><td>SIGQUIT</td><td>3</td><td>Ctrl+\\</td><td>Terminate + core dump</td></tr>\r\n<tr><td>SIGKILL</td><td>9</td><td>Zabardasti maro</td><td>Terminate (<b>catch/ignore nahi ho sakta</b>)</td></tr>\r\n<tr><td>SIGSEGV</td><td>11</td><td>Invalid memory access</td><td>Terminate + core dump</td></tr>\r\n<tr><td>SIGALRM</td><td>14</td><td>alarm() timer khatam</td><td>Terminate</td></tr>\r\n<tr><td>SIGTERM</td><td>15</td><td>Politely band karo (default kill)</td><td>Terminate</td></tr>\r\n<tr><td>SIGSTOP</td><td>19</td><td>Process roko</td><td>Stop (catch nahi ho sakta)</td></tr>\r\n<tr><td>SIGTSTP</td><td>20</td><td>Ctrl+Z</td><td>Stop</td></tr>\r\n<tr><td>SIGCHLD</td><td>17</td><td>Child khatam/ruka</td><td>Ignore</td></tr>\r\n<tr><td>SIGUSR1/2</td><td>10/12</td><td>User defined</td><td>Terminate</td></tr>\r\n</table>\r\n<p>Signal aane par process 3 mein se ek kar sakta hai: <b>Default action</b>, <b>Ignore</b> (SIG_IGN), ya <b>Catch</b> karke apna <b>signal handler</b> chalana. <b>SIGKILL aur SIGSTOP</b> ko catch/ignore/block nahi kar sakte.</p>\r\n<pre><code>#include &lt;stdio.h&gt;\r\n#include &lt;signal.h&gt;\r\n#include &lt;unistd.h&gt;\r\n\r\nvoid handler(int sig) {\r\n    printf(\"\\nCtrl+C (signal %d) mila, par main band nahi hoon!\\n\", sig);\r\n}\r\nint main() {\r\n    signal(SIGINT, handler);      // SIGINT ke liye handler register\r\n    while (1) { printf(\"kaam chal raha hai...\\n\"); sleep(2); }\r\n    return 0;\r\n}</code></pre>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u3-syscalls",
        "title": "3.6 System Calls: Files, Processes, Signals",
        "html": "<h3>3.6 System Calls for Files, Processes aur Signals</h3>\r\n<h4>A. File System Calls</h4>\r\n<p>File ko <b>file descriptor (fd)</b> se identify karte hain (non-negative integer). Standard: <b>0 = stdin, 1 = stdout, 2 = stderr</b>.</p>\r\n<table>\r\n<tr><th>System Call</th><th>Syntax</th><th>Kaam</th></tr>\r\n<tr><td><code>open</code></td><td><code>int open(const char *path, int flags, mode_t mode);</code></td><td>File kholo/banao. Flags: O_RDONLY, O_WRONLY, O_RDWR, O_CREAT, O_APPEND, O_TRUNC. Fail = -1</td></tr>\r\n<tr><td><code>read</code></td><td><code>ssize_t read(int fd, void *buf, size_t n);</code></td><td>n bytes padho. Return: bytes read, 0 = EOF, -1 = error</td></tr>\r\n<tr><td><code>write</code></td><td><code>ssize_t write(int fd, const void *buf, size_t n);</code></td><td>n bytes likho</td></tr>\r\n<tr><td><code>close</code></td><td><code>int close(int fd);</code></td><td>File band karo</td></tr>\r\n<tr><td><code>lseek</code></td><td><code>off_t lseek(int fd, off_t off, int whence);</code></td><td>File pointer move (SEEK_SET, SEEK_CUR, SEEK_END)</td></tr>\r\n<tr><td><code>stat</code></td><td><code>int stat(const char *path, struct stat *buf);</code></td><td>File ki info (size, permissions, inode)</td></tr>\r\n<tr><td><code>link / unlink</code></td><td><code>link(old, new); unlink(path);</code></td><td>Hard link banao / file delete</td></tr>\r\n<tr><td><code>dup / dup2</code></td><td><code>dup2(oldfd, newfd)</code></td><td>fd duplicate (redirection ke liye)</td></tr>\r\n<tr><td><code>chmod / chown</code></td><td></td><td>Permission/owner badlo</td></tr>\r\n</table>\r\n<pre><code>#include &lt;fcntl.h&gt;\r\n#include &lt;unistd.h&gt;\r\nint main() {\r\n    char buf[100];\r\n    int fd = open(\"a.txt\", O_RDONLY);\r\n    if (fd &lt; 0) { perror(\"open\"); return 1; }\r\n    int n = read(fd, buf, 100);       // file se padho\r\n    write(1, buf, n);                 // stdout (fd 1) par likho\r\n    close(fd);\r\n    return 0;\r\n}</code></pre>\r\n\r\n<h4>B. Process System Calls</h4>\r\n<table>\r\n<tr><th>Call</th><th>Kaam</th></tr>\r\n<tr><td><code>fork()</code></td><td>Child process banata. Parent ko child ka PID, child ko 0, error mein -1</td></tr>\r\n<tr><td><code>exec family</code> (execl, execv, execvp...)</td><td>Current process ki image ko nayi program se replace karta hai (PID same). Success par return nahi hota</td></tr>\r\n<tr><td><code>wait() / waitpid()</code></td><td>Parent child ke khatam hone ka wait karta (zombie rokne ke liye)</td></tr>\r\n<tr><td><code>exit()</code></td><td>Process khatam, status parent ko</td></tr>\r\n<tr><td><code>getpid() / getppid()</code></td><td>Apna / parent ka PID</td></tr>\r\n<tr><td><code>nice()</code></td><td>Priority badalna</td></tr>\r\n</table>\r\n<pre><code>#include &lt;stdio.h&gt;\r\n#include &lt;unistd.h&gt;\r\n#include &lt;sys/wait.h&gt;\r\nint main() {\r\n    pid_t pid = fork();\r\n    if (pid &lt; 0) { perror(\"fork\"); return 1; }\r\n    else if (pid == 0) {                       // child\r\n        printf(\"Child PID = %d\\n\", getpid());\r\n        execlp(\"ls\", \"ls\", \"-l\", NULL);        // child ab \"ls -l\" ban gaya\r\n    } else {                                   // parent\r\n        wait(NULL);                            // child ka wait\r\n        printf(\"Parent: child ho gaya\\n\");\r\n    }\r\n    return 0;\r\n}</code></pre>\r\n<div class=\"ex\"><b class=\"t\">Output question</b> <code>fork(); fork(); printf(\"Hi\");</code> kitni baar \"Hi\" print hoga? <b>4 baar</b> (n fork() calls = 2<sup>n</sup> processes).</div>\r\n\r\n<h4>C. Signal System Calls</h4>\r\n<table>\r\n<tr><th>Call</th><th>Kaam</th></tr>\r\n<tr><td><code>signal(sig, handler)</code></td><td>Signal ke liye handler set (SIG_IGN, SIG_DFL, ya function)</td></tr>\r\n<tr><td><code>sigaction()</code></td><td>Advanced, reliable signal handling</td></tr>\r\n<tr><td><code>kill(pid, sig)</code></td><td>Kisi process ko signal bhejna</td></tr>\r\n<tr><td><code>raise(sig)</code></td><td>Khud ko signal</td></tr>\r\n<tr><td><code>alarm(sec)</code></td><td>sec ke baad SIGALRM</td></tr>\r\n<tr><td><code>pause()</code></td><td>Signal aane tak process ko sulao</td></tr>\r\n<tr><td><code>sigprocmask()</code></td><td>Signals ko block/unblock</td></tr>\r\n</table>\r\n<div class=\"imp\"><b class=\"t\">System call vs Library function</b> <code>printf()</code> library function hai (user space, buffering karta hai) jo andar <code>write()</code> system call karta hai. System call seedha kernel se baat karta hai (mode switch, thoda slow).</div>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u3-qa",
        "title": "Unit 3: Predicted Questions",
        "html": "<h3>Unit 3: Predicted Exam Questions (with Answers)</h3>",
        "qas": [
          {
            "marks": "2M",
            "q": "Open source software kya hota hai? Ek example do.",
            "a": "Aisa software jiska source code public hai aur use dekh, badal, distribute kar sakte hain. Example: Linux, Apache, Firefox."
          },
          {
            "marks": "4M",
            "q": "Linux aur UNIX mein difference batao.",
            "a": "Section 3.1 ka table: cost, source, developer, hardware, shell, file systems, usage."
          },
          {
            "marks": "4M",
            "q": "Linux ka evolution (history) likho.",
            "a": "UNIX (1969) → GNU (1983) → MINIX (1987) → Linux kernel by Linus Torvalds (1991) → GPL aur GNU/Linux."
          },
          {
            "marks": "4M",
            "q": "Linux ki kuch distributions batao.",
            "a": "Debian family (Ubuntu, Mint, Kali), Red Hat family (RHEL, Fedora, CentOS), SUSE, Arch. Package managers apt, yum/dnf, zypper, pacman."
          },
          {
            "marks": "4M",
            "q": "Linux install karne ke steps likho.",
            "a": "ISO download → bootable USB → BIOS mein boot order → installer → partitioning (/, swap, /home) → user/timezone → GRUB install → reboot."
          },
          {
            "marks": "10M",
            "q": "Linux architecture ko diagram ke saath explain karo.",
            "a": "Fig 3.1 banao: Hardware → Kernel (process, memory, file system, device drivers) → system call interface/libraries → shell → user applications. Har layer ka 2 line kaam."
          },
          {
            "marks": "4M",
            "q": "Kernel kya hai? Iske functions batao.",
            "a": "OS ka core jo hardware se directly interact karta. Functions: process, memory, file, device management, networking, security. Linux kernel monolithic with loadable modules."
          },
          {
            "marks": "10M",
            "q": "Linux file system explain karo: inode, superblock, mounting.",
            "a": "Directory hierarchy (Fig 3.2), disk layout: boot block, superblock, inode table, data blocks (Fig 3.3), inode ke contents (Fig 3.4), mount/umount commands (Fig 3.5)."
          },
          {
            "marks": "2M",
            "q": "inode kya hai?",
            "a": "File ki metadata (owner, permissions, size, timestamps, data block pointers) rakhne wala data structure, file name ke alawa. Har file ka unique inode number."
          },
          {
            "marks": "4M",
            "q": "Hard link aur soft link mein antar.",
            "a": "Hard: same inode, original delete par data bachta. Soft: alag inode jo path store karta hai, original delete par broken, directory aur alag FS par bhi chal sakta."
          },
          {
            "marks": "4M",
            "q": "Internal aur external commands mein difference. Examples do.",
            "a": "Internal: shell built-in (cd, echo, pwd). External: alag executable file (ls, cp, grep). Check: type / which."
          },
          {
            "marks": "10M",
            "q": "Essential Linux commands ko syntax aur example ke saath explain karo (ls, cp, mv, rm, cat, grep, ps, kill, chmod, find).",
            "a": "Section 3.4 ke table se kam se kam 10 commands, har ek ke options ke saath."
          },
          {
            "marks": "4M",
            "q": "Zombie aur orphan process kya hain?",
            "a": "Zombie: exit ho chuka par parent ne wait nahi kiya. Orphan: parent pehle khatam, init (PID 1) adopt karta."
          },
          {
            "marks": "10M",
            "q": "Linux mein process management explain karo. fork aur exec ka use batao.",
            "a": "Fig 3.6, process states, ps/top/kill/nice, fork return values, exec ka image replace, wait, zombie. C code likho."
          },
          {
            "marks": "10M",
            "q": "Signal kya hai? Signal handling explain karo. Common signals list karo.",
            "a": "Definition, signal table (SIGINT, SIGKILL, SIGTERM...), 3 actions (default, ignore, catch), SIGKILL/SIGSTOP catch nahi hote, signal() ka program."
          },
          {
            "marks": "10M",
            "q": "File handling ke system calls (open, read, write, close, lseek) likho aur ek program do.",
            "a": "Section 3.6A ke syntax ka table, file descriptors 0/1/2, program jo file padh kar screen par likhe."
          },
          {
            "marks": "4M",
            "q": "System call aur library function mein difference.",
            "a": "Library function user space mein (printf, buffering), andar system call (write) karta. System call kernel mode switch, direct OS service."
          },
          {
            "marks": "4M",
            "q": "<code>fork(); fork(); fork();</code> kitne processes banayega?",
            "a": "2<sup>3</sup> = 8 processes total (7 naye child + 1 original)."
          }
        ],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": true
      }
    ],
    "quiz": [
      {
        "q": "Linux kernel kisne banaya?",
        "o": [
          "Dennis Ritchie",
          "Linus Torvalds",
          "Richard Stallman",
          "Ken Thompson"
        ],
        "a": 1
      },
      {
        "q": "inode mein kya store hota hai?",
        "o": [
          "File ka naam",
          "File ka data",
          "Naam ko chhod kar file ki metadata",
          "Directory path"
        ],
        "a": 2
      },
      {
        "q": "Kaun sa signal catch ya ignore NAHI ho sakta?",
        "o": [
          "SIGINT",
          "SIGTERM",
          "SIGKILL",
          "SIGALRM"
        ],
        "a": 2
      },
      {
        "q": "fork() -1 return kare to matlab?",
        "o": [
          "Success",
          "Child process",
          "Failure",
          "Parent process"
        ],
        "a": 2
      },
      {
        "q": "File system unmount karne ka command?",
        "o": [
          "unmount",
          "umount",
          "demount",
          "detach"
        ],
        "a": 1
      },
      {
        "q": "stderr ka file descriptor?",
        "o": [
          "0",
          "1",
          "2",
          "3"
        ],
        "a": 2
      },
      {
        "q": "Device files kis directory mein hoti hain?",
        "o": [
          "/etc",
          "/dev",
          "/bin",
          "/var"
        ],
        "a": 1
      },
      {
        "q": "fork(); fork(); ke baad kul kitne processes?",
        "o": [
          "2",
          "3",
          "4",
          "8"
        ],
        "a": 2
      }
    ]
  },
  {
    "id": "u4",
    "number": 4,
    "title": "Unit 4: Shell Programming & Scripting",
    "desc": "Shell types, redirection, pipes, vi & emacs editors, variables, control statements, find command, shell script examples, filters (grep, sed, awk), and C programming.",
    "topics": [
      {
        "id": "u4-shell",
        "title": "4.1 Shell Intro, Types, Commands",
        "html": "<h3>4.1 Introduction to Shell aur Various Shells</h3>\r\n<div class=\"def\"><b class=\"t\">Shell</b> Ek <b>command interpreter</b> program hai jo user ke commands padhta hai, unko samajhta hai aur kernel se execute karwata hai. User aur kernel ke beech ka layer. Do roop: <b>CLI</b> (terminal) aur scripting language.</div>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 620 100\" width=\"620\">\r\n  <rect x=\"5\" y=\"25\" width=\"100\" height=\"44\" rx=\"8\" class=\"c3\"/><text x=\"55\" y=\"52\" text-anchor=\"middle\" class=\"b\">User</text>\r\n  <path d=\"M105 47 H145\" class=\"ar\"/><text x=\"125\" y=\"38\" text-anchor=\"middle\" class=\"lt\" font-size=\"11\">cmd</text>\r\n  <rect x=\"150\" y=\"25\" width=\"130\" height=\"44\" rx=\"8\" class=\"c4\"/><text x=\"215\" y=\"52\" text-anchor=\"middle\" class=\"b\">Shell (bash)</text>\r\n  <path d=\"M280 47 H320\" class=\"ar\"/><text x=\"300\" y=\"38\" text-anchor=\"middle\" class=\"lt\" font-size=\"11\">call</text>\r\n  <rect x=\"325\" y=\"25\" width=\"120\" height=\"44\" rx=\"8\" class=\"c1\"/><text x=\"385\" y=\"52\" text-anchor=\"middle\" class=\"b\">Kernel</text>\r\n  <path d=\"M445 47 H485\" class=\"ar\"/>\r\n  <rect x=\"490\" y=\"25\" width=\"120\" height=\"44\" rx=\"8\" class=\"c2\"/><text x=\"550\" y=\"52\" text-anchor=\"middle\" class=\"b\">Hardware</text>\r\n</svg><div class=\"cap\">Fig 4.1: Shell ka role</div></div>\r\n<p><b>Shell kya karta hai:</b> prompt dikhana, command padhna, parse (words mein todna), wildcards/variables expand karna, command dhundhna (PATH), <code>fork + exec</code> karke chalana, output dikhana, repeat.</p>\r\n\r\n<h4>Various Shells of Linux</h4>\r\n<table>\r\n<tr><th>Shell</th><th>Full name</th><th>Binary</th><th>Khasiyat</th></tr>\r\n<tr><td><b>sh</b></td><td>Bourne Shell (Stephen Bourne)</td><td>/bin/sh</td><td>Original, scripting ke liye portable</td></tr>\r\n<tr><td><b>bash</b></td><td>Bourne Again Shell (GNU)</td><td>/bin/bash</td><td>Linux ka default; history, tab-completion, arrays</td></tr>\r\n<tr><td><b>csh</b></td><td>C Shell (Bill Joy)</td><td>/bin/csh</td><td>C jaisi syntax, aliases, history</td></tr>\r\n<tr><td><b>tcsh</b></td><td>Enhanced C shell</td><td>/bin/tcsh</td><td>Command-line editing</td></tr>\r\n<tr><td><b>ksh</b></td><td>Korn Shell (David Korn)</td><td>/bin/ksh</td><td>sh + csh features, fast</td></tr>\r\n<tr><td><b>zsh</b></td><td>Z Shell</td><td>/bin/zsh</td><td>Modern, plugins (macOS default)</td></tr>\r\n</table>\r\n<pre><code>echo $SHELL          # current login shell\r\ncat /etc/shells      # available shells\r\nchsh -s /bin/zsh     # shell badlo\r\nbash                 # naya bash shell shuru</code></pre>\r\n\r\n<h4>Shell Commands (Basic)</h4>\r\n<pre><code>echo \"Hello\"          # text print\r\ndate; cal; who        # ek line mein kai commands (; se)\r\nls -l | wc -l         # pipe\r\ncmd1 &amp;&amp; cmd2          # cmd1 safal ho tabhi cmd2\r\ncmd1 || cmd2          # cmd1 fail ho tabhi cmd2\r\ncmd &amp;                 # background\r\nhistory               # purane commands\r\nalias ll='ls -l'      # shortcut</code></pre>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u4-io",
        "title": "4.2 I/O Redirection aur Piping",
        "html": "<h3>4.2 I/O Redirection aur Piping</h3>\r\n<p>Har process ke paas 3 standard streams hote hain:</p>\r\n<table>\r\n<tr><th>Stream</th><th>fd</th><th>Default</th></tr>\r\n<tr><td>stdin (standard input)</td><td>0</td><td>Keyboard</td></tr>\r\n<tr><td>stdout (standard output)</td><td>1</td><td>Screen</td></tr>\r\n<tr><td>stderr (standard error)</td><td>2</td><td>Screen</td></tr>\r\n</table>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 620 130\" width=\"620\">\r\n  <rect x=\"10\" y=\"40\" width=\"100\" height=\"40\" class=\"c3\"/><text x=\"60\" y=\"65\" text-anchor=\"middle\" class=\"b\">Keyboard</text>\r\n  <path d=\"M110 60 H215\" class=\"ar\"/><text x=\"162\" y=\"52\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">stdin (0)</text>\r\n  <rect x=\"220\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" class=\"c1\"/><text x=\"290\" y=\"65\" text-anchor=\"middle\" class=\"b\">Command</text>\r\n  <path d=\"M360 45 H465\" class=\"ar\"/><text x=\"412\" y=\"37\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">stdout (1)</text>\r\n  <path d=\"M360 80 H465\" class=\"ar\"/><text x=\"412\" y=\"98\" text-anchor=\"middle\" class=\"lt\" font-size=\"12\">stderr (2)</text>\r\n  <rect x=\"470\" y=\"30\" width=\"140\" height=\"70\" class=\"c2\"/><text x=\"540\" y=\"70\" text-anchor=\"middle\" class=\"b\">Screen</text>\r\n</svg><div class=\"cap\">Fig 4.2: Standard streams</div></div>\r\n\r\n<h4>Redirection Operators</h4>\r\n<table>\r\n<tr><th>Operator</th><th>Matlab</th><th>Example</th></tr>\r\n<tr><td><code>&gt;</code></td><td>stdout ko file mein (overwrite)</td><td><code>ls &gt; list.txt</code></td></tr>\r\n<tr><td><code>&gt;&gt;</code></td><td>stdout ko file mein <b>append</b></td><td><code>date &gt;&gt; log.txt</code></td></tr>\r\n<tr><td><code>&lt;</code></td><td>file se stdin lena</td><td><code>wc -l &lt; data.txt</code></td></tr>\r\n<tr><td><code>2&gt;</code></td><td>stderr ko file mein</td><td><code>ls xyz 2&gt; err.txt</code></td></tr>\r\n<tr><td><code>2&gt;&gt;</code></td><td>stderr append</td><td><code>cmd 2&gt;&gt; err.log</code></td></tr>\r\n<tr><td><code>&amp;&gt;</code> ya <code>&gt; f 2&gt;&amp;1</code></td><td>stdout aur stderr dono ek file mein</td><td><code>cmd &gt; all.txt 2&gt;&amp;1</code></td></tr>\r\n<tr><td><code>/dev/null</code></td><td>\"Black hole\": output phek do</td><td><code>cmd 2&gt; /dev/null</code></td></tr>\r\n<tr><td><code>&lt;&lt;</code> (here document)</td><td>script ke andar hi input dena</td><td><code>cat &lt;&lt; EOF ... EOF</code></td></tr>\r\n</table>\r\n<div class=\"ex\"><b class=\"t\">Samjho</b> <code>sort &lt; names.txt &gt; sorted.txt</code>: names.txt se input lo, sort karo, sorted.txt mein likho.</div>\r\n\r\n<h4>Piping ( | )</h4>\r\n<p><b>Pipe</b> ek command ke <b>stdout</b> ko doosre ke <b>stdin</b> se jod deta hai (beech mein file nahi banti).</p>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 620 80\" width=\"620\">\r\n  <rect x=\"10\" y=\"20\" width=\"130\" height=\"40\" rx=\"8\" class=\"c1\"/><text x=\"75\" y=\"45\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">cat file.txt</text>\r\n  <path d=\"M140 40 H190\" class=\"ar\"/><text x=\"165\" y=\"32\" text-anchor=\"middle\" class=\"lt\" font-size=\"14\">|</text>\r\n  <rect x=\"195\" y=\"20\" width=\"130\" height=\"40\" rx=\"8\" class=\"c3\"/><text x=\"260\" y=\"45\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">sort</text>\r\n  <path d=\"M325 40 H375\" class=\"ar\"/><text x=\"350\" y=\"32\" text-anchor=\"middle\" class=\"lt\" font-size=\"14\">|</text>\r\n  <rect x=\"380\" y=\"20\" width=\"110\" height=\"40\" rx=\"8\" class=\"c4\"/><text x=\"435\" y=\"45\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">uniq</text>\r\n  <path d=\"M490 40 H535\" class=\"ar\"/><text x=\"512\" y=\"32\" text-anchor=\"middle\" class=\"lt\" font-size=\"14\">|</text>\r\n  <rect x=\"540\" y=\"20\" width=\"75\" height=\"40\" rx=\"8\" class=\"c2\"/><text x=\"577\" y=\"45\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">wc -l</text>\r\n</svg><div class=\"cap\">Fig 4.3: Pipeline: ek ka output = doosre ka input</div></div>\r\n<pre><code>ls -l | wc -l                    # files ginti\r\nps -ef | grep ssh                # ssh processes\r\ncat a.txt | sort | uniq -c       # unique lines + count\r\nwho | cut -d' ' -f1 | sort       # logged-in users ki list\r\nls | tee list.txt | wc -l        # tee: screen/pipe + file dono</code></pre>\r\n<table>\r\n<tr><th>Redirection</th><th>Pipe</th></tr>\r\n<tr><td>Command ↔ <b>file</b></td><td>Command ↔ <b>command</b></td></tr>\r\n<tr><td>Output file mein save hota hai</td><td>Temporary buffer (kernel), file nahi</td></tr>\r\n</table>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u4-editors",
        "title": "4.3 Vi aur Emacs Editors",
        "html": "<h3>4.3 Vi aur Emacs Editors</h3>\r\n<h4>Vi (Visual Editor)</h4>\r\n<p>Har UNIX/Linux par available <b>modal editor</b>. 3 modes:</p>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 560 190\" width=\"560\">\r\n  <rect x=\"190\" y=\"10\" width=\"180\" height=\"50\" rx=\"10\" class=\"c1\"/><text x=\"280\" y=\"32\" text-anchor=\"middle\" class=\"b\">Command Mode</text><text x=\"280\" y=\"49\" text-anchor=\"middle\" font-size=\"12\">(default, jab vi khulta)</text>\r\n  <rect x=\"10\" y=\"130\" width=\"180\" height=\"50\" rx=\"10\" class=\"c2\"/><text x=\"100\" y=\"152\" text-anchor=\"middle\" class=\"b\">Insert Mode</text><text x=\"100\" y=\"169\" text-anchor=\"middle\" font-size=\"12\">(text type karo)</text>\r\n  <rect x=\"370\" y=\"130\" width=\"180\" height=\"50\" rx=\"10\" class=\"c3\"/><text x=\"460\" y=\"152\" text-anchor=\"middle\" class=\"b\">Last-line (Ex) Mode</text><text x=\"460\" y=\"169\" text-anchor=\"middle\" font-size=\"12\">(: se shuru: save/quit)</text>\r\n  <path d=\"M215 60 L130 128\" class=\"ar\"/><text x=\"115\" y=\"95\" class=\"lt\" font-size=\"12\">i, a, o</text>\r\n  <path d=\"M110 128 L195 60\" class=\"ar\"/><text x=\"190\" y=\"115\" class=\"lt\" font-size=\"12\">Esc</text>\r\n  <path d=\"M345 60 L430 128\" class=\"ar\"/><text x=\"420\" y=\"95\" class=\"lt\" font-size=\"12\">:</text>\r\n  <path d=\"M450 128 L365 60\" class=\"ar\"/><text x=\"345\" y=\"115\" class=\"lt\" font-size=\"12\">Enter/Esc</text>\r\n</svg><div class=\"cap\">Fig 4.4: vi ke modes</div></div>\r\n<table>\r\n<tr><th>Mode</th><th>Commands</th></tr>\r\n<tr><td><b>Insert</b></td><td><code>i</code> (cursor se pehle), <code>a</code> (baad mein), <code>I</code> (line shuru), <code>A</code> (line end), <code>o</code> (neeche nayi line), <code>O</code> (upar nayi line). Wapas: <code>Esc</code></td></tr>\r\n<tr><td><b>Command (navigate/edit)</b></td><td><code>h j k l</code> (left, down, up, right), <code>w</code>/<code>b</code> (word aage/peeche), <code>0</code>/<code>$</code> (line start/end), <code>gg</code>/<code>G</code> (file start/end), <code>x</code> (char delete), <code>dd</code> (line delete), <code>dw</code>, <code>yy</code> (copy line), <code>p</code> (paste), <code>u</code> (undo), <code>Ctrl+r</code> (redo), <code>/word</code> (search), <code>n</code> (next)</td></tr>\r\n<tr><td><b>Last-line</b></td><td><code>:w</code> save, <code>:q</code> quit, <code>:wq</code> ya <code>ZZ</code> save+quit, <code>:q!</code> bina save quit, <code>:set nu</code> line numbers, <code>:%s/old/new/g</code> replace, <code>:10</code> line 10 par jao</td></tr>\r\n</table>\r\n<h4>Emacs</h4>\r\n<p>GNU Emacs ek <b>powerful, extensible</b> editor (non-modal: seedha type karo, commands <b>Ctrl</b> (C-) aur <b>Meta/Alt</b> (M-) se). Mail, shell, calendar sab andar chalta hai (Emacs Lisp).</p>\r\n<table>\r\n<tr><th>Key</th><th>Kaam</th></tr>\r\n<tr><td><code>C-x C-f</code></td><td>File kholo</td></tr>\r\n<tr><td><code>C-x C-s</code></td><td>Save</td></tr>\r\n<tr><td><code>C-x C-c</code></td><td>Emacs se bahar</td></tr>\r\n<tr><td><code>C-g</code></td><td>Command cancel</td></tr>\r\n<tr><td><code>C-s / C-r</code></td><td>Search aage / peeche</td></tr>\r\n<tr><td><code>C-k</code></td><td>Line ka baki hissa kaato (kill)</td></tr>\r\n<tr><td><code>C-y</code></td><td>Paste (yank)</td></tr>\r\n<tr><td><code>C-/</code> ya <code>C-x u</code></td><td>Undo</td></tr>\r\n<tr><td><code>C-a / C-e</code></td><td>Line start / end</td></tr>\r\n</table>\r\n<table>\r\n<tr><th>Vi</th><th>Emacs</th></tr>\r\n<tr><td>Modal (3 modes)</td><td>Non-modal</td></tr>\r\n<tr><td>Lightweight, har system par</td><td>Heavy, feature-rich, install karna padta</td></tr>\r\n<tr><td>Commands: letters</td><td>Commands: Ctrl/Meta key combos</td></tr>\r\n</table>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u4-vars",
        "title": "4.4 Variables, Meta Characters, Keywords",
        "html": "<h3>4.4 Variables, Shell Meta Characters, Keywords aur Built-in Commands</h3>\r\n<h4>Variables</h4>\r\n<ul>\r\n<li><b>User-defined:</b> <code>name=\"Rahul\"</code> (<b>= ke dono taraf space nahi</b>). Use: <code>$name</code> ya <code>${name}</code>.</li>\r\n<li><b>Environment variables</b> (system): <code>HOME, PATH, USER, SHELL, PWD, PS1</code>. Dekhne ke liye <code>env</code> ya <code>printenv</code>. Child process ko dene ke liye <code>export VAR=value</code>.</li>\r\n<li><b>Read-only:</b> <code>readonly x=5</code>. <b>Delete:</b> <code>unset x</code>.</li>\r\n<li><b>Input lena:</b> <code>read name</code> (<code>read -p \"Naam: \" name</code>).</li>\r\n</ul>\r\n<h5>Special (Positional) Variables</h5>\r\n<table>\r\n<tr><th>Variable</th><th>Matlab</th></tr>\r\n<tr><td><code>$0</code></td><td>Script ka naam</td></tr>\r\n<tr><td><code>$1 ... $9</code></td><td>Command-line arguments</td></tr>\r\n<tr><td><code>$#</code></td><td>Arguments ki sankhya</td></tr>\r\n<tr><td><code>$*</code>, <code>$@</code></td><td>Saare arguments</td></tr>\r\n<tr><td><code>$?</code></td><td>Pichle command ka exit status (0 = success, non-zero = fail)</td></tr>\r\n<tr><td><code>$$</code></td><td>Current shell ka PID</td></tr>\r\n<tr><td><code>$!</code></td><td>Last background process ka PID</td></tr>\r\n</table>\r\n<h4>Quoting aur Command Substitution</h4>\r\n<pre><code>x=10\r\necho \"Value $x\"      # Value 10   (double quote: variable expand hota hai)\r\necho 'Value $x'      # Value $x   (single quote: sab literal)\r\necho \"Aaj: $(date)\"  # command substitution (backtick `date` bhi chalta)\r\necho $((5 + 3))      # arithmetic: 8\r\nexpr 5 + 3           # arithmetic (purana tareeka)\r\necho \"a\\tb\" ; echo -e \"a\\tb\"   # \\ escape character</code></pre>\r\n\r\n<h4>Shell Meta Characters</h4>\r\n<table>\r\n<tr><th>Char</th><th>Matlab</th><th>Example</th></tr>\r\n<tr><td><code>*</code></td><td>Koi bhi characters (0 ya zyada)</td><td><code>ls *.txt</code></td></tr>\r\n<tr><td><code>?</code></td><td>Exactly ek character</td><td><code>ls file?.c</code></td></tr>\r\n<tr><td><code>[ ]</code></td><td>Range mein se ek character</td><td><code>ls [a-c]*</code>, <code>ls file[1-3]</code></td></tr>\r\n<tr><td><code>&gt; &gt;&gt; &lt;</code></td><td>Redirection</td><td></td></tr>\r\n<tr><td><code>|</code></td><td>Pipe</td><td></td></tr>\r\n<tr><td><code>&amp;</code></td><td>Background</td><td><code>sleep 5 &amp;</code></td></tr>\r\n<tr><td><code>;</code></td><td>Command separator</td><td><code>cd /tmp; ls</code></td></tr>\r\n<tr><td><code>$</code></td><td>Variable</td><td></td></tr>\r\n<tr><td><code>` `</code> / <code>$( )</code></td><td>Command substitution</td><td></td></tr>\r\n<tr><td><code>\\</code></td><td>Escape (agle character ka special matlab hatao)</td><td><code>echo \\*</code></td></tr>\r\n<tr><td><code>\" \"</code>, <code>' '</code></td><td>Quoting</td><td></td></tr>\r\n<tr><td><code>~</code></td><td>Home directory</td><td><code>cd ~</code></td></tr>\r\n<tr><td><code>#</code></td><td>Comment</td><td></td></tr>\r\n</table>\r\n\r\n<h4>Shell Keywords aur Built-in Commands</h4>\r\n<p><b>Keywords (reserved words):</b> <code>if then else elif fi case esac for while until do done function in select time</code>. In naamon se variable ya function ka naam nahi rakh sakte.</p>\r\n<p><b>Built-in commands:</b> <code>cd, echo, pwd, read, export, set, unset, alias, unalias, history, exit, exec, eval, source (.), test ([ ]), shift, trap, type, ulimit, umask, wait, kill, fg, bg, jobs, true, false</code>.</p>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u4-control",
        "title": "4.5 Shell Control Statements",
        "html": "<h3>4.5 Shell Control Statements (if, case, while, until, for)</h3>\r\n<h4>test condition ( [ ] )</h4>\r\n<table>\r\n<tr><th>Numbers</th><th>Strings</th><th>Files</th></tr>\r\n<tr><td><code>-eq</code> equal, <code>-ne</code> not equal<br><code>-gt</code> greater, <code>-lt</code> less<br><code>-ge</code> &gt;=, <code>-le</code> &lt;=</td><td><code>=</code> equal, <code>!=</code> not equal<br><code>-z s</code> khali, <code>-n s</code> khali nahi</td><td><code>-f</code> regular file hai<br><code>-d</code> directory<br><code>-r -w -x</code> read/write/exec permission<br><code>-s</code> size &gt; 0, <code>-e</code> exists</td></tr>\r\n</table>\r\n<p>Logical: <code>-a</code> (AND), <code>-o</code> (OR), <code>!</code> (NOT) ya <code>&amp;&amp;</code>, <code>||</code>.</p>\r\n\r\n<h4>if-then-else</h4>\r\n<pre><code>#!/bin/bash\r\nread -p \"Number daalo: \" n\r\nif [ $n -gt 0 ]; then\r\n    echo \"Positive\"\r\nelif [ $n -lt 0 ]; then\r\n    echo \"Negative\"\r\nelse\r\n    echo \"Zero\"\r\nfi</code></pre>\r\n\r\n<h4>case-switch</h4>\r\n<pre><code>#!/bin/bash\r\nread -p \"Option (start/stop/quit): \" opt\r\ncase $opt in\r\n    start)  echo \"Shuru kar raha hoon\" ;;\r\n    stop)   echo \"Band kar raha hoon\"  ;;\r\n    q*|quit) echo \"Bye\"                ;;\r\n    *)      echo \"Galat option\"        ;;   # default\r\nesac</code></pre>\r\n\r\n<h4>while, until aur for loops</h4>\r\n<pre><code># while: condition TRUE rehne tak chalta hai\r\ni=1\r\nwhile [ $i -le 5 ]; do\r\n    echo \"i = $i\"\r\n    i=$((i + 1))\r\ndone\r\n\r\n# until: condition FALSE rehne tak chalta hai (jab tak true na ho)\r\ni=1\r\nuntil [ $i -gt 5 ]; do\r\n    echo \"i = $i\"\r\n    i=$((i + 1))\r\ndone\r\n\r\n# for: list par loop\r\nfor f in *.txt; do\r\n    echo \"File: $f\"\r\ndone\r\nfor i in {1..5}; do echo $i; done       # range\r\nfor ((i=1; i&lt;=5; i++)); do echo $i; done  # C-style (bash)</code></pre>\r\n<p><b>break</b> (loop se bahar), <b>continue</b> (agle iteration par), <b>exit n</b> (script khatam).</p>\r\n<table>\r\n<tr><th>while</th><th>until</th></tr>\r\n<tr><td>Jab tak condition <b>true</b> hai, chalta hai</td><td>Jab tak condition <b>false</b> hai, chalta hai</td></tr>\r\n</table>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u4-find",
        "title": "4.6 find, Shell Scripts aur Examples",
        "html": "<h3>4.6 find Command, Shell Scripts, Tips aur Traps</h3>\r\n<h4>find command</h4>\r\n<p>Directory tree mein files <b>search</b> karta hai. Syntax: <code>find [path] [condition] [action]</code></p>\r\n<table>\r\n<tr><th>Command</th><th>Matlab</th></tr>\r\n<tr><td><code>find . -name \"*.txt\"</code></td><td>Naam se (current dir se)</td></tr>\r\n<tr><td><code>find / -iname \"notes*\"</code></td><td>Case-insensitive naam</td></tr>\r\n<tr><td><code>find . -type d</code></td><td>Sirf directories (<code>-type f</code> files, <code>l</code> links)</td></tr>\r\n<tr><td><code>find . -size +10M</code></td><td>10 MB se badi files</td></tr>\r\n<tr><td><code>find . -mtime -7</code></td><td>Pichle 7 din mein badli</td></tr>\r\n<tr><td><code>find . -user rahul</code></td><td>Is user ki files</td></tr>\r\n<tr><td><code>find . -perm 644</code></td><td>Permission 644 wali</td></tr>\r\n<tr><td><code>find . -name \"*.log\" -exec rm {} \\;</code></td><td>Mili files par command chalao (<code>{}</code> = file)</td></tr>\r\n<tr><td><code>find . -name \"*.tmp\" -delete</code></td><td>Seedha delete</td></tr>\r\n</table>\r\n\r\n<h4>Shell Script kaise likhte hain</h4>\r\n<ol>\r\n<li>File banao: <code>vi hello.sh</code></li>\r\n<li>Pehli line <b>shebang</b>: <code>#!/bin/bash</code> (konsa interpreter)</li>\r\n<li><b>Execute permission:</b> <code>chmod +x hello.sh</code></li>\r\n<li>Chalao: <code>./hello.sh</code> ya <code>bash hello.sh</code></li>\r\n</ol>\r\n<pre><code>#!/bin/bash\r\n# Script: greet.sh   Chalao: ./greet.sh Rahul\r\necho \"Script ka naam: $0\"\r\necho \"Namaste $1, aaj $(date +%A) hai\"\r\necho \"Total arguments: $#\"</code></pre>\r\n\r\n<h4>Useful Script Examples (exam mein aate hain)</h4>\r\n<pre><code># 1. Factorial\r\nread -p \"n: \" n; f=1\r\nfor ((i=1; i&lt;=n; i++)); do f=$((f * i)); done\r\necho \"Factorial = $f\"\r\n\r\n# 2. Even/Odd\r\nread -p \"n: \" n\r\nif [ $((n % 2)) -eq 0 ]; then echo \"Even\"; else echo \"Odd\"; fi\r\n\r\n# 3. Fibonacci (n terms)\r\nread -p \"n: \" n; a=0; b=1\r\nfor ((i=0; i&lt;n; i++)); do echo -n \"$a \"; t=$((a+b)); a=$b; b=$t; done; echo\r\n\r\n# 4. Largest of three numbers\r\nread a b c\r\nif [ $a -ge $b -a $a -ge $c ]; then echo \"$a\"\r\nelif [ $b -ge $c ]; then echo \"$b\"; else echo \"$c\"; fi\r\n\r\n# 5. Palindrome string check\r\nread s; r=$(echo $s | rev)\r\n[ \"$s\" = \"$r\" ] &amp;&amp; echo \"Palindrome\" || echo \"Palindrome nahi\"\r\n\r\n# 6. File ya directory check\r\nread -p \"Path: \" p\r\nif [ -f \"$p\" ]; then echo \"File hai\"; elif [ -d \"$p\" ]; then echo \"Directory hai\"; else echo \"Exist nahi\"; fi\r\n\r\n# 7. Table of n\r\nread n; for i in {1..10}; do echo \"$n x $i = $((n*i))\"; done</code></pre>\r\n\r\n<h4>Handling Documents (Text files ke saath kaam)</h4>\r\n<ul>\r\n<li><b>Here document:</b> script ke andar multi-line input.</li>\r\n<li><b>Files banana/jodna:</b> <code>cat &gt; f</code> (Ctrl+D se end), <code>cat f1 f2 &gt; f3</code>.</li>\r\n<li><b>Compare:</b> <code>diff f1 f2</code>, <code>cmp f1 f2</code>, <code>comm f1 f2</code>.</li>\r\n<li><b>Count/Sort:</b> <code>wc</code>, <code>sort</code>, <code>uniq</code>. <b>Search/Replace:</b> <code>grep</code>, <code>sed</code>. <b>Print:</b> <code>lpr</code>.</li>\r\n</ul>\r\n<pre><code>cat &lt;&lt; EOF &gt; report.txt\r\nNaam: $USER\r\nDate: $(date)\r\nEOF</code></pre>\r\n\r\n<h4>Tips and Traps</h4>\r\n<div class=\"grid2\">\r\n<div class=\"box exam\"><b class=\"t\">Tips</b>\r\n<ul><li>Hamesha <code>#!/bin/bash</code> likho.</li><li>Variables ko quotes mein rakho: <code>\"$var\"</code> (space wale naam ke liye).</li><li>Script mein <code>set -e</code> (error par ruk jao), <code>set -x</code> (debug trace).</li><li>Chhote, meaningful variable names, comments (<code>#</code>) likho.</li><li><code>$?</code> se command ka status check karo.</li></ul></div>\r\n<div class=\"box imp\"><b class=\"t\">Traps (galtiyan)</b>\r\n<ul><li><code>x = 5</code> galat, <code>x=5</code> sahi (= ke paas space nahi).</li><li><code>[ $a -eq 5 ]</code> mein <b>[ ke baad aur ] se pehle space</b> zaruri.</li><li>String compare ke liye <code>=</code>, number ke liye <code>-eq</code> (mix mat karo).</li><li>Execute permission bhoolna: \"Permission denied\".</li><li>Windows line endings (CRLF) se error aata hai.</li><li><code>rm -rf $dir/*</code> mein $dir khali ho to <code>rm -rf /*</code> ban sakta hai: dhyan!</li></ul></div>\r\n</div>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u4-c",
        "title": "4.7 C Programming in Linux aur Filters",
        "html": "<h3>4.7 C Language Programming in Linux (Prototyping, Coding, Compiling, Testing, Debugging)</h3>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 640 100\" width=\"640\">\r\n  <rect x=\"5\" y=\"30\" width=\"100\" height=\"44\" rx=\"8\" class=\"c3\"/><text x=\"55\" y=\"50\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">Prototyping</text><text x=\"55\" y=\"65\" text-anchor=\"middle\" font-size=\"11\">(design)</text>\r\n  <path d=\"M105 52 H125\" class=\"ar\"/>\r\n  <rect x=\"130\" y=\"30\" width=\"100\" height=\"44\" rx=\"8\" class=\"c4\"/><text x=\"180\" y=\"50\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">Coding</text><text x=\"180\" y=\"65\" text-anchor=\"middle\" font-size=\"11\">(vi hello.c)</text>\r\n  <path d=\"M230 52 H250\" class=\"ar\"/>\r\n  <rect x=\"255\" y=\"30\" width=\"100\" height=\"44\" rx=\"8\" class=\"c1\"/><text x=\"305\" y=\"50\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">Compiling</text><text x=\"305\" y=\"65\" text-anchor=\"middle\" font-size=\"11\">(gcc)</text>\r\n  <path d=\"M355 52 H375\" class=\"ar\"/>\r\n  <rect x=\"380\" y=\"30\" width=\"100\" height=\"44\" rx=\"8\" class=\"c2\"/><text x=\"430\" y=\"50\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">Testing</text><text x=\"430\" y=\"65\" text-anchor=\"middle\" font-size=\"11\">(./a.out)</text>\r\n  <path d=\"M480 52 H500 \" class=\"ar\"/>\r\n  <rect x=\"505\" y=\"30\" width=\"130\" height=\"44\" rx=\"8\" class=\"c6\"/><text x=\"570\" y=\"50\" text-anchor=\"middle\" class=\"b\" font-size=\"13\">Debugging</text><text x=\"570\" y=\"65\" text-anchor=\"middle\" font-size=\"11\">(gdb, valgrind)</text>\r\n</svg><div class=\"cap\">Fig 4.5: C program development cycle</div></div>\r\n<ol>\r\n<li><b>Prototyping:</b> pehle problem ka design/algorithm, function prototypes (declarations), header files decide karna. Jaise: <code>int add(int, int);</code></li>\r\n<li><b>Coding:</b> editor (vi/emacs/nano) mein source file <code>.c</code> likhna.</li>\r\n<li><b>Compiling:</b> <code>gcc</code> (GNU C Compiler).</li>\r\n<li><b>Testing:</b> alag-alag input ke saath chalakar output check.</li>\r\n<li><b>Debugging:</b> errors dhundhna aur theek karna.</li>\r\n</ol>\r\n<pre><code>// hello.c\r\n#include &lt;stdio.h&gt;\r\nint add(int a, int b);          // prototype\r\nint main() {\r\n    printf(\"Sum = %d\\n\", add(3, 5));\r\n    return 0;\r\n}\r\nint add(int a, int b) { return a + b; }</code></pre>\r\n<pre><code>gcc hello.c                  # a.out banta hai\r\n./a.out                      # chalao\r\ngcc hello.c -o hello         # output ka naam hello\r\ngcc -Wall -g hello.c -o hello   # -Wall: saari warnings, -g: debug info\r\ngcc -c hello.c               # sirf object file (hello.o)\r\ngcc a.o b.o -o prog          # linking\r\ngcc prog.c -lm               # math library link (-l library)\r\nmake                         # Makefile se build automate</code></pre>\r\n<h4>gcc ke 4 stages</h4>\r\n<p><code>Source (.c)</code> → <b>Preprocessing</b> (#include, #define expand: <code>gcc -E</code>) → <b>Compilation</b> (assembly .s: <code>gcc -S</code>) → <b>Assembly</b> (object .o: <code>gcc -c</code>) → <b>Linking</b> (executable).</p>\r\n<h4>Debugging</h4>\r\n<pre><code>gdb ./hello\r\n(gdb) break main        # breakpoint\r\n(gdb) run               # chalao\r\n(gdb) next / step       # line by line (step function ke andar jata)\r\n(gdb) print x           # variable dekho\r\n(gdb) backtrace         # call stack\r\n(gdb) continue / quit\r\nvalgrind ./hello        # memory leak detect</code></pre>\r\n<p>Errors: <b>Syntax</b> (compile time), <b>Linker</b> (undefined reference), <b>Runtime</b> (segmentation fault), <b>Logical</b> (galat answer).</p>\r\n\r\n<h3 style=\"margin-top:22px;border-top:2px solid var(--line);padding-top:14px\">Filters</h3>\r\n<div class=\"def\"><b class=\"t\">Filter</b> Aisa command jo <b>stdin se padhta hai, kuch transformation karta hai, aur stdout par likhta hai</b>. Pipes mein beech mein lagte hain. Examples: cat, head, tail, sort, uniq, wc, cut, tr, grep, sed, awk.</div>\r\n<table>\r\n<tr><th>Filter</th><th>Kaam</th><th>Example</th></tr>\r\n<tr><td><code>head / tail</code></td><td>Shuru / aakhri lines</td><td><code>head -n 5 f</code>, <code>tail -3 f</code></td></tr>\r\n<tr><td><code>sort</code></td><td>Lines sort: <code>-n</code> numeric, <code>-r</code> reverse, <code>-u</code> unique, <code>-k2</code> 2nd column</td><td><code>sort -nr marks.txt</code></td></tr>\r\n<tr><td><code>uniq</code></td><td>Aas-paas ki duplicate lines hatao (<code>-c</code> count, <code>-d</code> sirf dupes). Pehle sort karo</td><td><code>sort f | uniq -c</code></td></tr>\r\n<tr><td><code>cut</code></td><td>Columns/fields nikalo</td><td><code>cut -d: -f1 /etc/passwd</code></td></tr>\r\n<tr><td><code>tr</code></td><td>Characters translate/delete</td><td><code>tr 'a-z' 'A-Z' &lt; f</code>, <code>tr -d ' '</code></td></tr>\r\n<tr><td><code>wc</code></td><td>Count</td><td><code>wc -l f</code></td></tr>\r\n<tr><td><code>paste</code></td><td>Files ko column-wise jodo</td><td><code>paste f1 f2</code></td></tr>\r\n<tr><td><code>grep</code></td><td>Pattern search (regex). <code>-i -v -c -n -l -r -w</code>. <b>egrep/grep -E</b> (extended regex), <b>fgrep</b> (fixed string)</td><td><code>grep -n \"^root\" /etc/passwd</code></td></tr>\r\n<tr><td><code>sed</code></td><td>Stream editor: replace, delete</td><td><code>sed 's/old/new/g' f</code>, <code>sed '2d' f</code>, <code>sed -n '3,5p' f</code></td></tr>\r\n<tr><td><code>awk</code></td><td>Pattern-action language, column processing</td><td><code>awk '{print $1, $3}' f</code>, <code>awk -F: '{print $1}' /etc/passwd</code>, <code>awk '$3 &gt; 50 {print $1}' marks</code></td></tr>\r\n</table>\r\n<div class=\"ex\"><b class=\"t\">Example (pipeline)</b> Sabse zyada use hone wale 3 words: <code>cat f.txt | tr ' ' '\\n' | sort | uniq -c | sort -nr | head -3</code></div>\r\n<div class=\"imp\"><b class=\"t\">Regex basics (grep)</b> <code>^</code> line shuru, <code>$</code> line end, <code>.</code> koi ek char, <code>*</code> 0 ya zyada, <code>[abc]</code> inme se ek, <code>[^abc]</code> inke alawa, <code>\\&lt;word\\&gt;</code> poora word.</div>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u4-qa",
        "title": "Unit 4: Predicted Questions",
        "html": "<h3>Unit 4: Predicted Exam Questions (with Answers)</h3>",
        "qas": [
          {
            "marks": "2M",
            "q": "Shell kya hai?",
            "a": "Command interpreter jo user ke commands ko kernel tak pahunchata hai. Examples: bash, sh, csh, ksh."
          },
          {
            "marks": "4M",
            "q": "Linux ke alag-alag shells ke naam aur features likho.",
            "a": "Section 4.1 ka table: sh, bash, csh/tcsh, ksh, zsh."
          },
          {
            "marks": "10M",
            "q": "I/O redirection aur piping explain karo examples ke saath.",
            "a": "Standard streams 0/1/2 (Fig 4.2), operators &gt; &gt;&gt; &lt; 2&gt; 2&gt;&amp;1, pipe (Fig 4.3) examples: <code>ls | wc -l</code>, <code>sort &lt; a &gt; b</code>."
          },
          {
            "marks": "4M",
            "q": "Redirection aur pipe mein difference.",
            "a": "Redirection: command ↔ file. Pipe: command ↔ command (stdout → stdin), temporary kernel buffer."
          },
          {
            "marks": "10M",
            "q": "Vi editor ke modes aur important commands explain karo.",
            "a": "Fig 4.4: command, insert, last-line mode. Section 4.3 ke commands: i a o, dd yy p, x, u, /search, :w :q :wq :q!."
          },
          {
            "marks": "4M",
            "q": "Vi aur Emacs mein difference.",
            "a": "Vi modal, light; Emacs non-modal, extensible, Ctrl/Meta combos."
          },
          {
            "marks": "4M",
            "q": "Shell meta characters kya hain? Examples do.",
            "a": "Special meaning wale characters: * ? [ ] &gt; &lt; | &amp; ; $ \\ ` ~ # \" '. Table dikhao."
          },
          {
            "marks": "4M",
            "q": "Shell variables ke types aur special variables ($0, $#, $?, $$) batao.",
            "a": "User-defined, environment (export), read-only. Special: $0 script name, $1.. args, $# count, $* $@ all args, $? exit status, $$ PID."
          },
          {
            "marks": "10M",
            "q": "Shell control statements (if, case, while, until, for) syntax aur example ke saath likho.",
            "a": "Section 4.5 ke programs: if-elif-else-fi, case-esac, while-do-done, until, for. test operators: -eq -gt -f -d."
          },
          {
            "marks": "10M",
            "q": "Shell script likho: (a) factorial (b) fibonacci (c) palindrome (d) largest of 3 (e) even/odd.",
            "a": "Section 4.6 mein ready scripts hain. Shebang, read, logic, echo likhna mat bhoolo."
          },
          {
            "marks": "4M",
            "q": "while aur until loop mein difference.",
            "a": "while: condition true tak. until: condition false tak (true hote hi ruk jata)."
          },
          {
            "marks": "4M",
            "q": "find command ke options likho (name, type, size, mtime, exec).",
            "a": "Section 4.6 ka table."
          },
          {
            "marks": "4M",
            "q": "Shell script ki tips aur traps likho.",
            "a": "Tips: shebang, quotes, set -e, comments. Traps: = ke paas space, [ ] ke andar space, string vs number compare, permission, CRLF."
          },
          {
            "marks": "10M",
            "q": "Linux mein C program kaise banate, compile aur debug karte hain?",
            "a": "Fig 4.5, gcc options (-o -Wall -g -c -l), 4 stages (preprocess, compile, assemble, link), gdb commands (break, run, next, print), valgrind, Makefile."
          },
          {
            "marks": "10M",
            "q": "Filters kya hain? grep, sort, uniq, cut, tr, sed, awk ko examples se samjhao.",
            "a": "Definition + Section 4.7 ka table, ek pipeline example."
          },
          {
            "marks": "4M",
            "q": "<code>grep</code> ke options likho.",
            "a": "-i (case ignore), -v (invert), -n (line no.), -c (count), -l (file names), -r (recursive), -w (whole word), -E (extended regex)."
          },
          {
            "marks": "2M",
            "q": "Here document kya hai?",
            "a": "Script ke andar hi multi-line input dene ka tareeka: <code>cmd &lt;&lt; EOF ... EOF</code>."
          }
        ],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": true
      }
    ],
    "quiz": [
      {
        "q": "Output ko file mein append karne ka operator?",
        "o": [
          ">",
          ">>",
          "<",
          "|"
        ],
        "a": 1
      },
      {
        "q": "$? kya hold karta hai?",
        "o": [
          "Script ka PID",
          "Arguments ki sankhya",
          "Pichle command ka exit status",
          "Script ka naam"
        ],
        "a": 2
      },
      {
        "q": "Kaun sa loop condition false rehne tak chalta hai?",
        "o": [
          "while",
          "until",
          "for",
          "case"
        ],
        "a": 1
      },
      {
        "q": "vi mein save karke quit karne ka command?",
        "o": [
          ":q!",
          ":w",
          ":wq",
          ":x!"
        ],
        "a": 2
      },
      {
        "q": "Linux ka default shell?",
        "o": [
          "csh",
          "ksh",
          "bash",
          "zsh"
        ],
        "a": 2
      },
      {
        "q": "Inmein se kaun sa filter hai?",
        "o": [
          "cd",
          "grep",
          "mkdir",
          "pwd"
        ],
        "a": 1
      },
      {
        "q": "$# kya deta hai?",
        "o": [
          "Arguments ki sankhya",
          "Saare arguments",
          "PID",
          "Exit status"
        ],
        "a": 0
      },
      {
        "q": "Shell script ki pehli line (shebang)?",
        "o": [
          "#include",
          "#!/bin/bash",
          "//bash",
          "@bash"
        ],
        "a": 1
      }
    ]
  },
  {
    "id": "u5",
    "number": 5,
    "title": "Unit 5: Linux System Administration & Management",
    "desc": "File listing, ownership, access permissions (chmod), user & group management, booting, boot loaders (GRUB), init system, and shutdown process.",
    "topics": [
      {
        "id": "u5-ls",
        "title": "5.1 File Listing aur File Types",
        "html": "<h3>5.1 File Listings aur File/Directory Types</h3>\r\n<h4><code>ls -l</code> ka output samjho</h4>\r\n<pre><code>$ ls -l\r\n-rwxr-xr--  2  rahul  dev  4096  Nov 23 10:30  script.sh\r\ndrwxr-xr-x  3  rahul  dev  4096  Nov 20 09:15  projects</code></pre>\r\n<table>\r\n<tr><th>Part</th><th>Example</th><th>Matlab</th></tr>\r\n<tr><td>1. File type</td><td><code>-</code> / <code>d</code></td><td><code>-</code> regular file, <code>d</code> directory, <code>l</code> link</td></tr>\r\n<tr><td>2. Permissions</td><td><code>rwxr-xr--</code></td><td>User (rwx), Group (r-x), Others (r--)</td></tr>\r\n<tr><td>3. Link count</td><td><code>2</code></td><td>Is file ke hard links ki sankhya</td></tr>\r\n<tr><td>4. Owner</td><td><code>rahul</code></td><td>File ka malik (user)</td></tr>\r\n<tr><td>5. Group</td><td><code>dev</code></td><td>File ka group</td></tr>\r\n<tr><td>6. Size</td><td><code>4096</code></td><td>Bytes mein (<code>ls -lh</code> se KB/MB)</td></tr>\r\n<tr><td>7. Date &amp; time</td><td><code>Nov 23 10:30</code></td><td>Last modified</td></tr>\r\n<tr><td>8. Name</td><td><code>script.sh</code></td><td>File ka naam</td></tr>\r\n</table>\r\n\r\n<h4>File Types</h4>\r\n<table>\r\n<tr><th>Symbol</th><th>Type</th><th>Description</th></tr>\r\n<tr><td><code>-</code></td><td>Regular file</td><td>Text, binary, image, script</td></tr>\r\n<tr><td><code>d</code></td><td>Directory</td><td>Files ki list (naam → inode)</td></tr>\r\n<tr><td><code>l</code></td><td>Symbolic link</td><td>Doosre file ka shortcut</td></tr>\r\n<tr><td><code>c</code></td><td>Character device</td><td>Byte-by-byte devices: keyboard, terminal (<code>/dev/tty</code>)</td></tr>\r\n<tr><td><code>b</code></td><td>Block device</td><td>Block devices: disk (<code>/dev/sda</code>)</td></tr>\r\n<tr><td><code>p</code></td><td>Named pipe (FIFO)</td><td>IPC ke liye</td></tr>\r\n<tr><td><code>s</code></td><td>Socket</td><td>Network/IPC communication</td></tr>\r\n</table>\r\n<p><b>Hidden files:</b> naam <code>.</code> se shuru (<code>.bashrc</code>), <code>ls -a</code> se dikhte. <code>.</code> = current dir, <code>..</code> = parent dir.</p>\r\n\r\n<h4>Managing Files aur Directories</h4>\r\n<pre><code>touch f            # khali file\r\ncp a b ; cp -r d1 d2\r\nmv a b             # move / rename\r\nrm f ; rm -r d ; rmdir d\r\nmkdir -p a/b/c\r\nln a b ; ln -s a b     # hard / soft link\r\nfile f             # file ka type batao\r\nstat f             # detail info\r\ndu -sh dir         # directory size\r\ndf -h              # disk space\r\ntar -czvf bk.tar.gz dir    # compress archive; tar -xzvf se extract</code></pre>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u5-perm",
        "title": "5.2 Ownership aur Access Permissions",
        "html": "<h3>5.2 Ownership aur Access Permissions</h3>\r\n<p>Har file ka ek <b>owner (user)</b>, ek <b>group</b>, aur baaki sab <b>others</b>. Teeno ke liye alag permissions.</p>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 560 160\" width=\"560\">\r\n  <text x=\"10\" y=\"30\" font-family=\"Consolas,monospace\" font-size=\"22\" class=\"b lt\">- r w x   r - x   r - -</text>\r\n  <rect x=\"48\" y=\"40\" width=\"108\" height=\"8\" fill=\"#3b82f6\"/><text x=\"102\" y=\"68\" text-anchor=\"middle\" class=\"lt\" font-size=\"13\">User (u) = owner</text>\r\n  <rect x=\"172\" y=\"40\" width=\"108\" height=\"8\" fill=\"#22c55e\"/><text x=\"226\" y=\"68\" text-anchor=\"middle\" class=\"lt\" font-size=\"13\">Group (g)</text>\r\n  <rect x=\"296\" y=\"40\" width=\"108\" height=\"8\" fill=\"#f59e0b\"/><text x=\"350\" y=\"68\" text-anchor=\"middle\" class=\"lt\" font-size=\"13\">Others (o)</text>\r\n  <text x=\"102\" y=\"100\" text-anchor=\"middle\" class=\"lt\" font-size=\"13\">rwx = 4+2+1 = 7</text>\r\n  <text x=\"226\" y=\"100\" text-anchor=\"middle\" class=\"lt\" font-size=\"13\">r-x = 4+0+1 = 5</text>\r\n  <text x=\"350\" y=\"100\" text-anchor=\"middle\" class=\"lt\" font-size=\"13\">r-- = 4+0+0 = 4</text>\r\n  <text x=\"10\" y=\"140\" class=\"lt\" font-size=\"14\" font-weight=\"700\">Octal mode = 754</text>\r\n</svg><div class=\"cap\">Fig 5.2: Permission bits aur octal value</div></div>\r\n<table>\r\n<tr><th>Permission</th><th>File par</th><th>Directory par</th><th>Value</th></tr>\r\n<tr><td><b>r</b> (read)</td><td>Content padh sakte</td><td>Contents list (ls) kar sakte</td><td>4</td></tr>\r\n<tr><td><b>w</b> (write)</td><td>Content badal sakte</td><td>Andar file banana/delete/rename</td><td>2</td></tr>\r\n<tr><td><b>x</b> (execute)</td><td>Program ki tarah chala sakte</td><td>Andar enter (cd) kar sakte</td><td>1</td></tr>\r\n</table>\r\n\r\n<h4>chmod (change mode)</h4>\r\n<pre><code># Symbolic mode: chmod [ugoa][+-=][rwx] file\r\nchmod u+x script.sh          # owner ko execute do\r\nchmod g-w file               # group se write hatao\r\nchmod o=r file               # others sirf read\r\nchmod a+r file               # sabko read   (a = all)\r\nchmod u=rwx,g=rx,o=r file    # alag-alag set\r\n\r\n# Octal mode\r\nchmod 755 file     # rwxr-xr-x\r\nchmod 644 file     # rw-r--r--   (normal text file)\r\nchmod 600 file     # rw-------   (private)\r\nchmod 777 file     # sabko sab   (khatarnak)\r\nchmod -R 755 dir   # recursive</code></pre>\r\n<div class=\"ex\"><b class=\"t\">Numerical</b> <code>rw-r-----</code> ka octal? User rw- = 6, group r-- = 4, others --- = 0 → <b>640</b>. Aur 751 ka symbolic? 7=rwx, 5=r-x, 1=--x → <b>rwxr-x--x</b>.</div>\r\n\r\n<h4>chown / chgrp</h4>\r\n<pre><code>sudo chown rahul file          # owner badlo\r\nsudo chown rahul:dev file      # owner aur group dono\r\nsudo chown -R rahul dir\r\nchgrp dev file                 # sirf group badlo</code></pre>\r\n\r\n<h4>umask (default permissions)</h4>\r\n<p>Nayi file ke default permissions = <b>base − umask</b>. Base: file = 666, directory = 777. Agar <code>umask 022</code> to file = 666 − 022 = <b>644</b>, directory = 777 − 022 = <b>755</b>. Dekhne ke liye <code>umask</code> type karo.</p>\r\n\r\n<h4>Special Permissions</h4>\r\n<table>\r\n<tr><th>Bit</th><th>Octal</th><th>Kaam</th></tr>\r\n<tr><td><b>SUID</b> (s on user x)</td><td>4000</td><td>Program owner ke rights se chalta (jaise <code>passwd</code>)</td></tr>\r\n<tr><td><b>SGID</b> (s on group x)</td><td>2000</td><td>Group ke rights se; directory mein nayi files same group</td></tr>\r\n<tr><td><b>Sticky bit</b> (t)</td><td>1000</td><td>Directory mein sirf file ka owner hi delete kar sakta (<code>/tmp</code>)</td></tr>\r\n</table>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u5-users",
        "title": "5.3 Users aur Home Directory",
        "html": "<h3>5.3 User aur Uski Home Directory</h3>\r\n<p>Linux <b>multiuser</b> hai. Har user ka <b>UID</b> aur <b>GID</b> hota hai. <b>root</b> (UID 0) superuser hai: sab kuch kar sakta.</p>\r\n<table>\r\n<tr><th>Type</th><th>UID range</th></tr>\r\n<tr><td>root</td><td>0</td></tr>\r\n<tr><td>System users (services)</td><td>1-999</td></tr>\r\n<tr><td>Normal users</td><td>1000+</td></tr>\r\n</table>\r\n\r\n<h4>Important Files</h4>\r\n<table>\r\n<tr><th>File</th><th>Kaam</th></tr>\r\n<tr><td><code>/etc/passwd</code></td><td>User accounts. Format (7 fields):<br><code>username:x:UID:GID:comment:home:shell</code><br>Example: <code>rahul:x:1001:1001:Rahul Sharma:/home/rahul:/bin/bash</code></td></tr>\r\n<tr><td><code>/etc/shadow</code></td><td>Encrypted (hashed) passwords + expiry. Sirf root padh sakta</td></tr>\r\n<tr><td><code>/etc/group</code></td><td>Groups aur unke members</td></tr>\r\n<tr><td><code>/etc/sudoers</code></td><td>Kaun sudo use kar sakta</td></tr>\r\n<tr><td><code>~/.bashrc, ~/.bash_profile</code></td><td>User ki shell settings (login par)</td></tr>\r\n</table>\r\n\r\n<h4>Home Directory</h4>\r\n<p>Har user ki apni <b>home directory</b> (<code>/home/username</code>, root ki <code>/root</code>). Login par yahin pahunchte, personal files, config (dotfiles) yahin. <code>~</code> = home. Naya user banate time <code>/etc/skel</code> se default files copy hoti hain.</p>\r\n\r\n<h4>User Management Commands (root/sudo se)</h4>\r\n<pre><code>sudo useradd -m -s /bin/bash -G dev rahul   # user banao (-m home dir, -s shell, -G group)\r\nsudo passwd rahul                           # password set\r\nsudo usermod -aG sudo rahul                 # group mein add\r\nsudo userdel -r rahul                       # delete (-r home bhi)\r\nsudo groupadd dev ; sudo groupdel dev       # group\r\nid rahul ; whoami ; who ; last              # info\r\nsu - rahul                                  # user switch\r\nsudo command                                # ek command admin ki tarah</code></pre>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u5-boot",
        "title": "5.4 Booting, Boot Loaders, init, Shutdown",
        "html": "<h3>5.4 Booting aur Shutting Down (Boot Loaders, LILO, GRUB, Bootstrapping, init, Services)</h3>\r\n<h4>Linux Boot Sequence</h4>\r\n<div class=\"fig\">\r\n<svg viewBox=\"0 0 560 360\" width=\"560\">\r\n  <rect x=\"140\" y=\"5\" width=\"280\" height=\"42\" rx=\"8\" class=\"c3\"/><text x=\"280\" y=\"31\" text-anchor=\"middle\" class=\"b\">1. BIOS / UEFI (POST, firmware)</text>\r\n  <path d=\"M280 47 V62\" class=\"ar\"/>\r\n  <rect x=\"140\" y=\"64\" width=\"280\" height=\"42\" rx=\"8\" class=\"c4\"/><text x=\"280\" y=\"82\" text-anchor=\"middle\" class=\"b\">2. MBR (stage 1 boot loader, 512 bytes)</text><text x=\"280\" y=\"98\" text-anchor=\"middle\" font-size=\"11\">boot device ka pehla sector</text>\r\n  <path d=\"M280 106 V121\" class=\"ar\"/>\r\n  <rect x=\"140\" y=\"123\" width=\"280\" height=\"42\" rx=\"8\" class=\"c5\"/><text x=\"280\" y=\"141\" text-anchor=\"middle\" class=\"b\">3. GRUB / LILO (boot loader)</text><text x=\"280\" y=\"157\" text-anchor=\"middle\" font-size=\"11\">menu dikhata, kernel + initrd load karta</text>\r\n  <path d=\"M280 165 V180\" class=\"ar\"/>\r\n  <rect x=\"140\" y=\"182\" width=\"280\" height=\"42\" rx=\"8\" class=\"c1\"/><text x=\"280\" y=\"200\" text-anchor=\"middle\" class=\"b\">4. Kernel load &amp; init</text><text x=\"280\" y=\"216\" text-anchor=\"middle\" font-size=\"11\">hardware detect, root FS mount (initramfs)</text>\r\n  <path d=\"M280 224 V239\" class=\"ar\"/>\r\n  <rect x=\"140\" y=\"241\" width=\"280\" height=\"42\" rx=\"8\" class=\"c2\"/><text x=\"280\" y=\"259\" text-anchor=\"middle\" class=\"b\">5. init / systemd (PID 1)</text><text x=\"280\" y=\"275\" text-anchor=\"middle\" font-size=\"11\">pehla user-space process</text>\r\n  <path d=\"M280 283 V298\" class=\"ar\"/>\r\n  <rect x=\"140\" y=\"300\" width=\"280\" height=\"42\" rx=\"8\" class=\"c6\"/><text x=\"280\" y=\"318\" text-anchor=\"middle\" class=\"b\">6. Runlevel / Target: services start</text><text x=\"280\" y=\"334\" text-anchor=\"middle\" font-size=\"11\">network, sshd, GUI... → Login prompt</text>\r\n</svg><div class=\"cap\">Fig 5.3: Linux boot sequence</div></div>\r\n\r\n<h4>Bootstrapping</h4>\r\n<p>Chhote program se bade program ko load karne ki chain (bootstrap = \"bootstraps\"). ROM ka firmware (BIOS) → MBR ka chhota loader → bada boot loader (GRUB) → kernel → init. Har stage agle bade stage ko load karti hai.</p>\r\n\r\n<h4>Boot Loaders: LILO vs GRUB</h4>\r\n<table>\r\n<tr><th>Point</th><th>LILO (Linux Loader)</th><th>GRUB (Grand Unified Bootloader)</th></tr>\r\n<tr><td>Config file</td><td><code>/etc/lilo.conf</code></td><td><code>/boot/grub/grub.cfg</code> (<code>/etc/default/grub</code>)</td></tr>\r\n<tr><td>Config badalne ke baad</td><td>Har baar <code>lilo</code> command chalani padti hai (MBR update)</td><td>Zaruri nahi (boot par config padhta)</td></tr>\r\n<tr><td>Interactive shell</td><td>Nahi</td><td>Haan: boot time par command line</td></tr>\r\n<tr><td>File system samajh</td><td>Nahi, sector addresses use karta</td><td>Haan (ext4 etc. padh sakta)</td></tr>\r\n<tr><td>Multi-boot (dual boot)</td><td>Sakta hai</td><td>Aasan, menu</td></tr>\r\n<tr><td>Aaj</td><td>Purana, band ho chuka</td><td>Standard (GRUB2)</td></tr>\r\n</table>\r\n\r\n<h4>init Process aur Runlevels</h4>\r\n<p><b>init</b> kernel ka start kiya hua <b>pehla process (PID 1)</b>. Ye baaki saare processes aur services ko start karta hai, orphans ko adopt karta hai.</p>\r\n<table>\r\n<tr><th>Runlevel (SysV)</th><th>Matlab</th><th>systemd target</th></tr>\r\n<tr><td>0</td><td>Halt / Shutdown</td><td>poweroff.target</td></tr>\r\n<tr><td>1</td><td>Single-user (maintenance / recovery)</td><td>rescue.target</td></tr>\r\n<tr><td>2</td><td>Multi-user, no network (Debian: full)</td><td>-</td></tr>\r\n<tr><td>3</td><td>Multi-user with network, <b>text mode</b></td><td>multi-user.target</td></tr>\r\n<tr><td>4</td><td>Unused / custom</td><td>-</td></tr>\r\n<tr><td>5</td><td>Multi-user + <b>GUI</b></td><td>graphical.target</td></tr>\r\n<tr><td>6</td><td>Reboot</td><td>reboot.target</td></tr>\r\n</table>\r\n<p>SysV init mein <code>/etc/inittab</code> (default runlevel) aur <code>/etc/rc.d/rcN.d/</code> scripts: <b>S</b>nn = Start, <b>K</b>nn = Kill. Naye distros <b>systemd</b> use karte hain (parallel start, fast).</p>\r\n<pre><code>runlevel                          # current runlevel\r\ninit 3 ; telinit 5                # runlevel badlo\r\nsystemctl get-default             # default target\r\nsystemctl set-default graphical.target</code></pre>\r\n\r\n<h4>System Services</h4>\r\n<p>Background programs (<b>daemons</b>): sshd, httpd/apache2, cron, cups, network. Naam aksar <b>d</b> se khatam.</p>\r\n<pre><code># systemd (aaj ke Linux)\r\nsystemctl start sshd        # abhi chalu\r\nsystemctl stop sshd\r\nsystemctl restart sshd\r\nsystemctl status sshd       # halat\r\nsystemctl enable sshd       # boot par auto-start\r\nsystemctl disable sshd\r\nsystemctl list-units --type=service\r\n\r\n# purana SysV\r\nservice sshd start          # ya  /etc/init.d/sshd start\r\nchkconfig sshd on</code></pre>\r\n\r\n<h4>Shutting Down aur Rebooting</h4>\r\n<p>Seedha power off na karo: running processes ko <b>SIGTERM</b> phir <b>SIGKILL</b> milta hai, disk buffers <b>sync</b> hote hain, file systems unmount hote hain. Isse data corruption bachta hai.</p>\r\n<pre><code>shutdown -h now           # abhi halt/poweroff\r\nshutdown -h +10           # 10 minute baad\r\nshutdown -h 22:30         # 10:30 PM par\r\nshutdown -r now           # reboot\r\nshutdown -c               # scheduled shutdown cancel\r\npoweroff ; halt ; reboot  # seedhe options\r\ninit 0 ; init 6           # runlevel se</code></pre>\r\n<div class=\"exam\"><b class=\"t\">Exam Point</b> Boot order yaad rakho: <b>BIOS → MBR → GRUB → Kernel → init (PID 1) → runlevel scripts → login</b>.</div>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": false
      },
      {
        "id": "u5-qa",
        "title": "Unit 5: Predicted Questions",
        "html": "<h3>Unit 5: Predicted Exam Questions (with Answers)</h3>",
        "qas": [
          {
            "marks": "4M",
            "q": "<code>ls -l</code> ka output explain karo.",
            "a": "Fig 5.1: file type, permissions (u/g/o), link count, owner, group, size, date/time, name."
          },
          {
            "marks": "4M",
            "q": "Linux mein file ke types likho.",
            "a": "Regular (-), directory (d), symbolic link (l), character device (c), block device (b), named pipe (p), socket (s)."
          },
          {
            "marks": "10M",
            "q": "File ownership aur access permissions explain karo. chmod ke dono modes batao.",
            "a": "u/g/o, r/w/x (4/2/1), file vs directory par meaning, chmod symbolic (u+x, g-w) aur octal (755, 644), chown, chgrp, umask, Fig 5.2."
          },
          {
            "marks": "4M",
            "q": "chmod 754 file ka kya matlab hai?",
            "a": "Owner 7 = rwx, group 5 = r-x, others 4 = r--. Yani rwxr-xr--."
          },
          {
            "marks": "4M",
            "q": "umask kya hai? umask 022 se nayi file ki permissions?",
            "a": "Default permissions mask. File = 666 − 022 = 644, directory = 777 − 022 = 755."
          },
          {
            "marks": "4M",
            "q": "SUID, SGID aur sticky bit kya hain?",
            "a": "SUID: owner ke rights se chale (passwd). SGID: group ke rights / directory mein group inherit. Sticky bit: directory mein sirf owner delete kare (/tmp)."
          },
          {
            "marks": "4M",
            "q": "/etc/passwd file ke fields explain karo.",
            "a": "username:x:UID:GID:comment:home:shell. Password asli /etc/shadow mein hashed."
          },
          {
            "marks": "4M",
            "q": "User banane aur delete karne ke commands likho. Home directory kya hoti hai?",
            "a": "useradd -m, passwd, usermod, userdel -r. Home = user ki personal directory (/home/name), login par yahin."
          },
          {
            "marks": "10M",
            "q": "Linux boot process explain karo diagram ke saath.",
            "a": "Fig 5.3: BIOS/UEFI+POST → MBR → boot loader (GRUB) → kernel load → init (PID 1) → runlevel → services → login."
          },
          {
            "marks": "4M",
            "q": "LILO aur GRUB mein difference.",
            "a": "Section 5.4 ka table: config file, interactive shell, FS support, update ki zarurat."
          },
          {
            "marks": "4M",
            "q": "Bootstrapping kya hai?",
            "a": "Chhote program se bade program ko load karne ki chain: BIOS → MBR → GRUB → kernel → init."
          },
          {
            "marks": "4M",
            "q": "init process aur runlevels explain karo.",
            "a": "init PID 1 hai, services start karta. Runlevels 0 halt, 1 single user, 3 multi-user text, 5 GUI, 6 reboot. Systemd targets."
          },
          {
            "marks": "4M",
            "q": "System services kaise start/stop/enable hoti hain?",
            "a": "systemctl start/stop/restart/status/enable/disable service. Purana: service name start, chkconfig."
          },
          {
            "marks": "2M",
            "q": "Linux ko safely shutdown kaise karte hain?",
            "a": "<code>shutdown -h now</code> (ya <code>poweroff</code>), reboot ke liye <code>shutdown -r now</code>. Processes ko signals, disk sync, FS unmount."
          }
        ],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": true
      },
      {
        "id": "final-qa",
        "title": "Most Important Questions (Quick List)",
        "html": "<h3>Overall Most Important / Repeated Topics (RTU Pattern)</h3>\r\n<div class=\"imp\"><b class=\"t\">Zaroor taiyaar karo (high probability)</b>\r\n<ol>\r\n<li><b>CPU Scheduling numericals</b> (FCFS, SJF, SRTF, RR, Priority): Gantt chart + avg WT/TAT.</li>\r\n<li><b>Banker's algorithm numerical</b> (safe sequence) aur Deadlock conditions/prevention/recovery.</li>\r\n<li><b>Page replacement numericals</b> (FIFO, LRU, OPT) aur Belady's anomaly.</li>\r\n<li><b>Process states, PCB, context switch</b>, IPC, threads models.</li>\r\n<li><b>Semaphore</b> problems: producer-consumer, readers-writers, dining philosophers.</li>\r\n<li><b>Paging/Segmentation</b> address translation, TLB EAT numerical, virtual memory, thrashing.</li>\r\n<li><b>Linux:</b> architecture, file system (inode, superblock), commands, fork/exec, signals, system calls.</li>\r\n<li><b>Shell scripts</b> (factorial, fibonacci, palindrome), redirection/pipes, filters (grep, sed, awk), vi commands.</li>\r\n<li><b>Linux admin:</b> chmod (symbolic + octal), file types, /etc/passwd, boot process, GRUB, runlevels.</li>\r\n</ol></div>\r\n<div class=\"exam\"><b class=\"t\">Exam Strategy</b>\r\n<ul><li>Har 10 marks ke answer mein <b>definition + diagram + points + example</b> zaroor likho.</li>\r\n<li>Numerical mein <b>har step</b> dikhao, final answer underline karo.</li>\r\n<li>Diagram clear aur labeled banao: marks milte hain.</li>\r\n<li>Commands ka <b>syntax + example + output</b> likho.</li></ul></div>",
        "qas": [],
        "hasCpuSim": false,
        "hasBankerSim": false,
        "hasPageSim": false,
        "hasQuiz": true
      }
    ],
    "quiz": [
      {
        "q": "chmod 644 file se permissions?",
        "o": [
          "rwxr-xr-x",
          "rw-r--r--",
          "rw-rw-rw-",
          "r--r--r--"
        ],
        "a": 1
      },
      {
        "q": "init process ka PID?",
        "o": [
          "0",
          "1",
          "2",
          "100"
        ],
        "a": 1
      },
      {
        "q": "Reboot ke liye runlevel?",
        "o": [
          "0",
          "1",
          "5",
          "6"
        ],
        "a": 3
      },
      {
        "q": "Hashed passwords kahan store hote hain?",
        "o": [
          "/etc/passwd",
          "/etc/shadow",
          "/etc/group",
          "/home"
        ],
        "a": 1
      },
      {
        "q": "ls -l mein pehla character \"d\" ka matlab?",
        "o": [
          "Device",
          "Directory",
          "Data",
          "Deleted"
        ],
        "a": 1
      },
      {
        "q": "Aaj ka standard Linux boot loader?",
        "o": [
          "LILO",
          "GRUB",
          "NTLDR",
          "BOOTMGR"
        ],
        "a": 1
      },
      {
        "q": "umask 022 par nayi file ki default permission?",
        "o": [
          "755",
          "644",
          "666",
          "022"
        ],
        "a": 1
      },
      {
        "q": "Boot order sahi hai?",
        "o": [
          "Kernel → BIOS → GRUB → init",
          "BIOS → GRUB → Kernel → init",
          "GRUB → BIOS → init → Kernel",
          "init → Kernel → BIOS → GRUB"
        ],
        "a": 1
      }
    ]
  }
];
