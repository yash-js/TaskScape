
# TaskScape ️

Effortlessly organize your tasks and projects with this Trello-inspired task management tool built on Next.js and powered by Prisma, Clerk, MySQL, Tailwind CSS, Shadown UI, and Stripe.

## Features ✨

- Visual task boards: Create boards, lists, and cards to visualize your workflows and streamline collaboration.
- Drag-and-drop functionality: Easily move cards between lists to prioritize tasks and track progress.
- Card details and comments: Add descriptions, comments, due dates, attachments, and checklists to tasks for clarity and organization.
- User management: Invite team members, assign tasks, and manage permissions to control access and collaboration.
- Authentication and authorization: Secure your workspace with Clerk for seamless user registration, login, and role-based access control.
- Payment integration: Seamlessly accept payments with Stripe for premium features or subscriptions (optional).
- Responsive design: Adapts seamlessly to different screen sizes for optimal viewing on any device.
- Unsplash API integration: Enhance your boards with stunning background images.

## Tech Stack ️

-  Frontend: Next.js, Tailwind CSS, Shadown UI
-  Backend:  Prisma, MySQL
-  Authentication: Clerk
-  Payments: Stripe
-  Imagery: Unsplash API


## Getting Started 

Clone the repository:
`git clone https://github.com/your-username/taskscape.git`

Install dependencies:
`cd taskscape`

`npm install`

Create a **.env** file and add below environment variables:

- #### Clerk
    	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_KEY
    	CLERK_SECRET_KEY=YOUR_KEY
    	NEXT_PUBLIC_CLERK_SIGN_IN_URL=/SIGN-IN
    	NEXT_PUBLIC_CLERK_SIGN_UP_URL=/SIGN-UP
    	NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    	NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

- #### Prisma
        DATABASE_URL=mysql://...

- #### Stripe 
    	STRIPE_API_KEY=...
    	STRIPE_WEBHOOK_SECRET=...

- #### Unsplash 
        NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=
        NEXT_PUBLIC_UNSPLASH_SECRET_KEY=
        STRIPE_API_KEY=


- Start the development server:

`npm run dev`

Open http://localhost:3000 in your browser.


## License 

This project is licensed under the MIT License.

## Acknowledgements 

1. Trello for inspiring this project
2. Next.js for providing a powerful framework
3. Prisma for simplifying database interactions
4. Clerk for effortless authentication
5. Stripe for payment processing (optional)
6. Tailwind CSS for utility-first styling
7. Shadown UI for accessible and beautiful components
8. Heartfelt Special Thanks to [Antonio Erdeljac](https://www.codewithantonio.com/projects/trello-clone "Trello Clone By Antonio Erdeljac")
