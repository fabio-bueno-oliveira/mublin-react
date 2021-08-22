<Header as='h4'>Postagens recentes</Header>
                                <Feed className='pt-1 mt-0'>
                                    {/* <Feed.Event className='mb-3 feed-item-wrapper newPost' style={{height:'59px'}}>
                                        <Feed.Label image={userInfo.picture ? 'https://ik.imagekit.io/mublin/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefinedAvatar} onClick={() => history.push('/'+userInfo.username)} className='cpointer' />
                                        <Feed.Content className='mb-0 mt-0'>
                                            <Feed.Summary className='mb-0'>
                                                <div>
                                                    <Header 
                                                        as='h4'
                                                        className='mb-0' 
                                                        style={{cursor:'pointer',opacity:'0.5',marginTop:'7px'}}
                                                        onClick={() => setModalNewPost(true)}
                                                    >
                                                        Publicar algo...
                                                    </Header>
                                                    <Button primary circular icon='pencil' size='tiny'
                                                        onClick={() => setModalNewPost(true)}
                                                        style={{
                                                            height:'fit-content',
                                                            position:'absolute',
                                                            top:'13px',
                                                            right:'10px',
                                                        }} 
                                                    />
                                                </div>
                                            </Feed.Summary>
                                        </Feed.Content>
                                    </Feed.Event> */}
                                    {/* <Modal
                                        size='tiny'
                                        open={modalNewPost}
                                        onClose={() => setModalNewPost(false)}
                                    >
                                        <Modal.Content>
                                            <div className='mb-3'>
                                                <Image avatar src={userInfo.picture ? 'https://ik.imagekit.io/mublin/users/avatars/'+userInfo.id+'/'+userInfo.picture : undefinedAvatar} />
                                                <span>Publicar como {userInfo.name}</span>
                                            </div>
                                            <Form>
                                                <Form.TextArea
                                                    value={postText}
                                                    onChange={(e) => setPostText(e.target.value)}
                                                />
                                            </Form>
                                            <div>
                                                <Header as='h6' className='mt-3 mb-1'>
                                                    <Icon name='image outline' />
                                                    <Header.Content>Enviar imagem</Header.Content>
                                                </Header>
                                                <div className="customFileUpload">
                                                    {!imagePostUrl ? ( 
                                                        <>
                                                            <IKUpload 
                                                                fileName="img"
                                                                folder={uploadPath}
                                                                tags={["post","feed"]}
                                                                useUniqueFileName={true}
                                                                isPrivateFile= {false}
                                                                onError={onUploadError}
                                                                onSuccess={onUploadSuccess}
                                                            />
                                                        </>
                                                    ) : (
                                                        <><Image src={'https://ik.imagekit.io/mublin/posts/'+imagePostUrl} size='small' /> <Icon className='cpointer mt-1' color='red' name='trash alternate outline' onClick={() => setImagePostUrl(null)} /></>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='mt-4 mb-3 pb-3'>
                                                <Button
                                                    floated='right'
                                                    content={isLoading ? 'Publicando...' : 'Publicar'} 
                                                    size='small' 
                                                    primary 
                                                    disabled={(!postText || isLoading) ? true : false}
                                                    onClick={submitPost}
                                                />
                                                <Button floated='right' size='small' onClick={() => setModalNewPost(false)}>
                                                    Fechar
                                                </Button>
                                            </div>
                                        </Modal.Content>
                                    </Modal> */}
                                    {feed.requesting ? (
                                        <Segment>
                                            <Placeholder>
                                            <Placeholder.Header image>
                                                <Placeholder.Line />
                                                <Placeholder.Line />
                                            </Placeholder.Header>
                                            <Placeholder.Paragraph>
                                                <Placeholder.Line length='medium' />
                                                <Placeholder.Line length='short' />
                                            </Placeholder.Paragraph>
                                            </Placeholder>
                                        </Segment>
                                    ) : (
                                        <>
                                            {!feed.error && feed.list.map((item, key) =>
                                                <Feed.Event key={key} className='mb-3'>
                                                    <Feed.Label>
                                                        <img src={item.relatedUserPicture ? item.relatedUserPicture : undefinedAvatar} alt={'Foto de '+item.relatedUserName} style={{cursor:'pointer'}} onClick={() => history.push('/'+item.relatedUserUsername)} />
                                                        {item.relatedUserPlan === 'Pro' && <Label size="mini" className="ml-2 p-1">Pro</Label>}
                                                        {item.relatedUserUsername === userInfo.username &&
                                                            <Icon name='trash alternate outline' style={{fontSize:'0.8em',marginTop:'14px'}} className='cpointer' onClick={() => showModalPost(item.id)} />
                                                        }
                                                    </Feed.Label>
                                                    <Feed.Content className='mt-1' style={{fontSize:'12.3px'}}>
                                                        {feed.requesting ? (
                                                            <Feed.Date style={{fontWeight:'500'}}>
                                                                Carregando...
                                                            </Feed.Date>
                                                        ) : (
                                                            <Feed.Date style={{fontWeight:'500'}} title={Date(item.created)}>
                                                                há {formatDistance(new Date(item.created * 1000), new Date(), {locale:pt})}
                                                            </Feed.Date>
                                                        )}
                                                        <Feed.Summary>
                                                            <Feed.User style={{fontWeight:'600'}} onClick={() => history.push('/'+item.relatedUserUsername)}>{item.relatedUserName+' '+item.relatedUserLastname} {!!item.relatedUserVerified && <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' />}</Feed.User> <span style={{fontWeight:'500'}}>{item.action}</span>
                                                        </Feed.Summary>
                                                        { (item.categoryId === 8) && 
                                                            <Feed.Extra text content={item.extraText} />
                                                        }
                                                        {item.image && 
                                                            <Feed.Extra images>
                                                                <a onClick={() => {
                                                                    showImage('https://ik.imagekit.io/mublin/posts/'+item.image)
                                                                }}>
                                                                    <img src={'https://ik.imagekit.io/mublin/posts/'+item.image} />
                                                                </a>
                                                            </Feed.Extra>
                                                        }
                                                        {!feed.requesting &&
                                                            <Feed.Meta>
                                                                <Feed.Like onClick={!item.likedByMe ? () => likeFeedPost(item.id) : () => unlikeFeedPost(item.id)}>
                                                                    <Icon loading={likeFeedPostLoading === item.id || unlikeFeedPostLoading === item.id} name={(likeFeedPostLoading === item.id || unlikeFeedPostLoading === item.id) ? 'spinner' : 'like'} color={item.likedByMe ? 'red' : ''}/>
                                                                </Feed.Like> {item.likes}
                                                            </Feed.Meta>
                                                        }
                                                    </Feed.Content>
                                                </Feed.Event>
                                            )}
                                            <Modal
                                                size='tiny'
                                                basic
                                                closeIcon
                                                open={modalImage}
                                                onClose={() => setModalImage(false)}
                                            >
                                                <Modal.Content>
                                                    <Image src={imageToShow} />
                                                </Modal.Content>
                                            </Modal>
                                            <Feed.Event>
                                                <Feed.Label>
                                                    <img src={LogoMublinCircular} alt='Mublin' />
                                                </Feed.Label>
                                                <Feed.Content className='mt-1' style={{fontSize:'12.3px'}}>
                                                    <Feed.Date style={{fontWeight:'500'}}>
                                                        há {formatDistance(new Date('2021-03-04'), new Date(), {locale:pt})}
                                                    </Feed.Date>
                                                    <Feed.Summary>
                                                        <Feed.User style={{fontWeight:'600',cursor:'default'}}>Mublin <Icon name='check circle' color='blue' className='verifiedIcon' title='Verificado' /></Feed.User> <span style={{fontWeight:'500'}}>escreveu</span>
                                                    </Feed.Summary>
                                                    <Feed.Extra text content="Bem-vindo à versão Beta do Mublin! Você faz parte de um seleto grupo de pessoas que estão fazendo parte dos primeiros testes neste pré-lançamento. Este é um espaço feito para trazer mais facilidade à rotina de pessoas que amam música e que estão de alguma forma envolvidos com projetos de música. Esperamos que goste!" />
                                                </Feed.Content>
                                            </Feed.Event>
                                        </>
                                    )}
                                </Feed>